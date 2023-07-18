import Head from 'next/head';
import { HeaderResponsive } from '../components/Header';
import { FooterLinks } from '../components/Footer';
import { ArticlesCardsGrid } from '../components/Card';
import { Title } from '@mantine/core';
import { AuthenticationForm } from '../components/Authentication';


const links = [
  { link: '/', label: 'Home' },
  { link: '/customer', label: 'Our Customer' },
  { link: 'https://forms.gle/2n5c4y1MFGoSnHsw6', label: 'Pre-Order', isExternal: true },
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

const Authentication: React.FC = () => {
  return (
    <div>
      <Head>
        <title>Our Customers</title>
        <meta name="description" content="Check out our customers testimonial" />
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
       Sign in to Admin Dashboard
      </Title>

      <AuthenticationForm/>
      
      <FooterLinks data={footerLinks} />
    </div>
  );
};

export default Authentication;
