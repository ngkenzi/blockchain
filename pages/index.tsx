import { useState, useEffect } from 'react';
import Head from 'next/head';
import axios from 'axios';
import axiosRetry from 'axios-retry';
import { Grid, Text, Input, Title, Paper, Col, Image, Select } from '@mantine/core';
import { HeaderResponsive } from '../components/Header';
import { FooterLinks } from '../components/Footer';

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
    const footerLinks = [
      {
        title: 'Company',
        links: [
          { label: 'About', link: '/about' },
          // Add more links as needed
        ],
      },
      // Add more groups as needed
    ];
    const universities = [
      { label: 'Universiti Malaya (UM)', value: '0123' },
      { label: 'Universiti Sains Malaysia (USM)', value: '0123' },
      { label: 'Universiti Kebangsaan Malaysia (UKM)', value: '0123' },
      { label: 'Universiti Putra Malaysia (UPM)', value: '0x01Ff83b084498CfDa27497F14D5c2AdbB5a7f73D' },
      { label: 'Universiti Teknologi Malaysia (UPM)', value: '0123' },
      { label: 'Universiti Islam Antarabangsa Malaysia (UIAM)', value: '0123' },
      { label: 'Universiti Utara Malaysia (UUM)', value: '0123' },
      { label: 'Universiti Malaysia Sarawak (UNIMAS)', value: '0123' },
      { label: 'Universiti Malaysia Sabah (UMS)', value: '0123' },
      { label: 'Universiti Pendidikan Sultan Idris (UPSI)', value: '0123' },
      { label: 'Universiti Sains Islam Malaysia (USIM)', value: '0123' },
      { label: 'Universiti Teknologi MARA (UiTM)', value: '0123' },
      { label: 'Universiti Malaysia Terengganu (UMT)', value: '0123' },
      { label: 'Universiti Tun Hussein Onn (UTHM)', value: '0123' },
      { label: 'Universiti Teknikal Malaysia Melaka (UTeM)', value: '0123' },
      { label: 'Universiti Malaysia Pahang (UMP)', value: '0123' },
      { label: 'Universiti Malaysia Perlis (UniMAP)', value: '0123' },
      { label: 'Universiti Sultan Zainal Abidin (UniSZA)', value: '0123' },
      { label: 'Universiti Malaysia Kelantan (UMK)', value: '0123' },
      { label: 'Universiti Pertahanan Nasional Malaysia (UPNM)', value: '0123' },
    ];
    const [address, setAddress] = useState('');
    const [selectedUniversity, setSelectedUniversity] = useState('');
    const [nfts, setNfts] = useState<NFT[]>([]);
    const [search, setSearch] = useState('');
    const network_id = '137';

    const axiosInstance = axios.create();
    axiosRetry(axiosInstance, { retries: 3 });

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setSearch(event.target.value);
    };

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
    
    <div style={{ minHeight: '100vh', padding: '0px' }}>
      <Head>
        <title>Home</title>
        <meta name="description" content="Verify and Validate your certificates with MSP Cert" />
      </Head>
        <HeaderResponsive links={links} />
        <Title 
      order={3} 
      style={{
      fontWeight: 'bold',
      marginTop: '20px', // change this to whatever value you need
      }} 
      align="center"
      >
       Students Certificates Ownership
      </Title>
      <Text component="label" htmlFor="address-input" weight={700} style={{ marginBottom: '5px' }}>
          Select your University
      </Text>
      <Select
      placeholder="Select a university"
      data={universities}
      value={address}
      onChange={setAddress}
      style={{ width: '100%', padding: '10px', fontSize: '1rem' }}
      />
      <Text component="label" htmlFor="address-input" weight={700} style={{ marginBottom: '5px' }}>
          Search Student Name
      </Text>
     

      <Input
        id="search-input"
        type="text"
        placeholder="Search for Students Name..."
        value={search}
        onChange={handleSearchChange}
        style={{ width: '100%', padding: '10px', fontSize: '1rem', marginBottom: '20px' }}
      />

  <Grid gutter="md">
  {nfts.filter(nft => nft.name?.toLowerCase().includes(search.toLowerCase())).map((nft, index) => (
          <Col key={index} md={6} lg={4}>
            <Paper style={{ marginBottom: '20px', padding: '10px' }}>
              <Image
                src={nft.image_url}
                alt="NFT"
                fit="cover"
                caption={nft.name}
                style={{ borderRadius: '4px' }}
              />
              <Text size="xl" weight={700} style={{ marginBottom: '5px' }}>
                {nft.name}
              </Text>
              <Text size="sm" color="gray">
                {nft.description}
              </Text>
            </Paper>
          </Col>
        ))}
      </Grid>
      <FooterLinks data={footerLinks} />
    </div>
  );
};

export default Home;