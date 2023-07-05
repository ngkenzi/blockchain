import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [address, setAddress] = useState('');
  const [nfts, setNfts] = useState([]);
  const network_id = '137';

  const fetchNFTs = async () => {
    let page = 1;
    let moreDataExists = true;
    let nftData = [];

    while (moreDataExists) {
      let url = `http://localhost:8000/https://api.chainbase.online/v1/account/nfts?chain_id=${network_id}&address=${address}&page=${page}&limit=100`;
      const response = await axios.get(url, {
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': '2S65t1iBkZGg0KsMrWqGRGR9LLX',
        },
      });

      if (response.status !== 200) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const pageData = response.data.data.map((nft) => ({
        ...nft.metadata,
        image_url: nft.metadata && nft.metadata.image ? nft.metadata.image.replace('ipfs://', 'https://ipfs.io/ipfs/') : '',
      }));

      nftData = [...nftData, ...pageData];

      // If the number of items returned is less than the limit, it means there is no more data.
      moreDataExists = pageData.length === 100;
      page++;

      // Wait for 1 second between requests to avoid rate limiting
      if (moreDataExists) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    setNfts(nftData);
  }



  useEffect(() => {
    if (address) fetchNFTs();
  }, [address]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 py-2">
      <h1 className="text-4xl font-bold mb-10">NFT ownership display</h1>

      <div className="w-1/2">
        <label className="block mb-2 text-sm font-bold text-gray-700" htmlFor="address-input">Address</label>
        <input className="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
          id="address-input"
          type="text"
          placeholder="Address"
          value={address}
          onChange={e => setAddress(e.target.value)} />
      </div>
      <button className="px-4 py-2 mt-5 font-bold text-white bg-blue-500 rounded hover:bg-blue-700" onClick={fetchNFTs}>Show me!</button>

      <div className="flex flex-wrap justify-center mt-10">
        {nfts.map((nft, index) => (
          <div key={index} className="w-64 m-4 bg-white rounded shadow-md">
            <img className="w-full h-64 rounded-t" src={nft.image_url} alt="NFT image" />
            <div className="p-4">
              <h2 className="text-xl font-bold">{nft.name}</h2>
              <p className="mt-2 text-gray-600">{nft.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
