import { useState, useEffect } from 'react';
import axios from 'axios';
import axiosRetry from 'axios-retry';
import { Grid, Text, Input, Button } from '@mantine/core';
import { HeaderResponsive } from '../components/Header';

interface NFT {
  name: string;
  description: string;
  image_url: string;
  // Add more properties if needed
}

const Home = () => {

    const links = [
        { link: '/', label: 'Home' },
        { link: '/upskill', label: 'Online Courses' },
        { link: '/authentication', label: 'Admin'},
        
        // Add more links as needed
      ]; 
  const [address, setAddress] = useState('');
  const [nfts, setNfts] = useState<NFT[]>([]);
  const network_id = '137';

  const axiosInstance = axios.create();
  axiosRetry(axiosInstance, { retries: 3 });

  const fetchNFTs = async () => {
    let page = 1;
    let moreDataExists = true;
    let nftData: NFT[] = [];

    while (moreDataExists) {
      let url = `http://localhost:8000/https://api.chainbase.online/v1/account/nfts?chain_id=${network_id}&address=${address}&page=${page}&limit=100`;

      try {
        const response = await axiosInstance.get(url, {
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': '2S65t1iBkZGg0KsMrWqGRGR9LLX',
          },
        });

        console.log(response.data);

        if (response.status !== 200) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const pageData = response.data.data.map((nft: any) => ({
          ...nft.metadata,
          image_url: nft.metadata && nft.metadata.image ? nft.metadata.image.replace('ipfs://', 'https://ipfs.io/ipfs/') : '',
        }));


        nftData = [...nftData, ...pageData];

        // If the number of items returned is less than the limit, it means there is no more data.
        moreDataExists = pageData.length === 100;
        page++;

        // Wait for 1 second between requests to avoid rate limiting
        if (moreDataExists) {
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }
      } catch (error) {
        if (error.response && error.response.status === 429) {
          // Handle rate limit error
          console.error('Rate limit exceeded. Please slow down your requests.');
          break; // break the loop if rate limit is exceeded
        } else {
          // Handle general errors
          console.error(error);
        }
      }
    }

    setNfts(nftData);
  };

  useEffect(() => {
    if (address) fetchNFTs();
  }, [address]);

  return (
    
    <div style={{ minHeight: '100vh', padding: '20px' }}>
        <HeaderResponsive links={links} />
        <h1>Students Certificates Ownership</h1>

      <div style={{ marginBottom: '20px' }}>
        <label style={{ fontSize: '1rem', fontWeight: 'bold', marginBottom: '5px', display: 'block' }} htmlFor="address-input">
          Address
        </label>
        <Input
          id="address-input"
          type="text"
          placeholder="Address"
          value={address}
          onChange={(e) => setAddress(e.currentTarget.value)}
          style={{ width: '100%', padding: '10px', fontSize: '1rem' }}
        />
      </div>

      <Button
        variant="outline"
        color="blue"
        onClick={fetchNFTs}
        style={{ marginBottom: '20px' }}
      >
        Show me!
      </Button>

      <Grid gutter="md">
        {nfts.map((nft, index) => (
          <div key={index} style={{ width: '100%', marginBottom: '20px' }}>
            <img style={{ width: '100%', height: 'auto', borderRadius: '4px' }} src={nft.image_url} alt="NFT" />
            <div style={{ padding: '10px' }}>
              <Text style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '5px' }}>{nft.name}</Text>
              <Text style={{ fontSize: '1rem', color: 'gray' }}>{nft.description}</Text>
            </div>
          </div>
        ))}
      </Grid>
    </div>
  );
};

export default Home;