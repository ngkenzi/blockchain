import axios from 'axios';
const ethers = require("ethers");
const util = require("../constants");
const myContract = require("../contracts/LazyNFT.json");
const SIGNING_DOMAIN_NAME = "LazyNFT-Voucher";
const SIGNING_DOMAIN_VERSION = "1";

class LazyMinter {
    /**
     * Create a new LazyMinter targeting a deployed instance of the LazyNFT contract.
     *
     * @param {Object} options
     * @param {ethers.Contract} contract an ethers Contract that's wired up to the deployed contract
     * @param {ethers.Signer} signer a Signer whose account is authorized to mint NFTs on the deployed contract
     */
    // constructor({ contract, signer }) {
    //     this.contract = contract
    //     this.signer = signer
    // }

    /**
     * Creates a new NFTVoucher object and signs it using this LazyMinter's signing key.
     *
     * @param {ethers.BigNumber | number} tokenId the id of the un-minted NFT
     * @param {string} uri the metadata URI to associate with this NFT
     * @param {ethers.BigNumber | number} minPrice the minimum price (in wei) that the creator will accept to redeem this NFT. defaults to zero
     *
     * @returns {Promise<NFTVoucher>}
     */
    async createVoucher(tokenId, uri, minPrice) {
        // Request permission to access user accounts
        //await window.ethereum.request({ method: "eth_requestAccounts" });

        const privateKey = "e58b8ac14e21ccaef4017ac44748fd3669a232a9ee7daf6a74aeb6279fa86add";
        const provider = new ethers.providers.JsonRpcProvider('https://polygon-mainnet.g.alchemy.com/v2/GcZf35hKIVbLQKS8m0wprSq_jHauI4jL');
        //const provider = new ethers.providers.Web3Provider(window.ethereum);
        //const signer = provider.getSigner();
        const signer = new ethers.Wallet(privateKey).connect(provider); // ethers.Wallet constructor now takes a single argument and the connect method is used to associate a provider

        minPrice = ethers.utils.parseUnits(minPrice, 2);

        const voucher = { tokenId, uri, minPrice };
        const domain = await this._signingDomain();
        const types = {
            NFTVoucher: [
                { name: "tokenId", type: "uint256" },
                { name: "minPrice", type: "uint256" },
                { name: "uri", type: "string" },
            ],
        };
        const signature = await signer._signTypedData(domain, types, voucher);
        return {
            ...voucher,
            signature,
        };
    }

    async redeem(voucher, tokenId) {
        // Request permission to access user accounts
        //await window.ethereum.request({ method: "eth_requestAccounts" });

        //const provider = new ethers.providers.Web3Provider(window.ethereum);
        const privateKey = "e58b8ac14e21ccaef4017ac44748fd3669a232a9ee7daf6a74aeb6279fa86add";
        const provider = new ethers.providers.JsonRpcProvider('https://polygon-mainnet.g.alchemy.com/v2/GcZf35hKIVbLQKS8m0wprSq_jHauI4jL');

        const response = await axios.get(`/api/getWalletAddress?tokenId=${tokenId}`);
        const wAddress = response.data;
        console.log("w Address", wAddress);

        //const wAddress = "0x01Ff83b084498CfDa27497F14D5c2AdbB5a7f73D"
        //const signer = provider.getSigner();
        const signer = new ethers.Wallet(privateKey).connect(provider); // ethers.Wallet constructor now takes a single argument and the connect method is used to associate a provider

        let gasPrice = await provider.getGasPrice();
        const MIN_GAS_PRICE = ethers.utils.parseUnits('50', 'gwei');

        if (gasPrice.lt(MIN_GAS_PRICE)) { // If the fetched gas price is lower than the threshold
            gasPrice = MIN_GAS_PRICE.mul(2); // Double the threshold gas price or set a specific value
        }

        const lazyNFT = new ethers.Contract(
            util.CONTRACT_ADDRESS,
            myContract.abi,
            signer
        );
        //return lazyNFT.redeem(await signer.getAddress(), voucher);
        try {
            return await lazyNFT.redeem(wAddress, voucher, {
                gasPrice: gasPrice
            });
        } catch (error) {
            console.error("Error in redeeming: ", error);
        }

    }

    /**
     * @private
     * @returns {object} the EIP-721 signing domain, tied to the chainId of the signer
     */
    async _signingDomain() {
        if (this._domain != null) {
            console.log("it s not null");
            return this._domain;
        }

        this._domain = {
            name: SIGNING_DOMAIN_NAME,
            version: SIGNING_DOMAIN_VERSION,
            verifyingContract: util.CONTRACT_ADDRESS,
        };
        return this._domain;
    }
}

export default LazyMinter;
