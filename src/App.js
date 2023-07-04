import React, { useState, useEffect } from 'react';

function App() {
  // Initialize state variables
  const [apiKey, setApiKey] = useState("");
  const [address, setAddress] = useState("");
  const [nfts, setNfts] = useState([]);

  // Function to fetch NFTs
  const fetchNFTs = async () => {
    let url = `https://api.nftport.xyz/v0/accounts/${address}?chain=polygon&include=metadata`;
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": process.env.REACT_APP_NFT_PORT_API
      },
    });
    const json = await response.json();
    // Reverse the order of the NFTs
    setNfts(json['nfts'].reverse());
  }

  // Call the fetchNFTs function when the button is clicked
  const handleClick = () => {
    fetchNFTs();
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 py-2">
      <h1 className="text-4xl font-bold mb-10">NFT ownership display</h1>

      <div className="w-1/2">
        <label className="block mb-2 text-sm font-bold text-gray-700" htmlFor="address-input">Address</label>
        <input className="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline" id="address-input" type="text" placeholder="Address" value={address} onChange={e => setAddress(e.target.value)} />
      </div>
      <button className="px-4 py-2 mt-5 font-bold text-white bg-blue-500 rounded hover:bg-blue-700" onClick={handleClick}>Show me!</button>

      <div className="flex flex-wrap justify-center mt-10">
        {nfts.map((nft, index) => (
          <div key={index} className="w-64 m-4 bg-white rounded shadow-md">
            <img className="w-full h-64 rounded-t" src={nft['cached_file_url']} alt="NFT image" />
            <div className="p-4">
              <h2 className="text-xl font-bold">{nft['name']}</h2>
              <p className="mt-2 text-gray-600">{nft['description']}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default App;
