import Head from 'next/head';
import { HeaderResponsive } from '../components/Header';
import { FooterLinks } from '../components/Footer';
import { ArticlesCardsGrid } from '../components/Card';
import { Title, Grid } from '@mantine/core';
import { AuthenticationForm } from '../components/Authentication';
import { ArticleCardVertical } from '../components/Courses';


const links = [
  { link: '/', label: 'Home' },
  { link: '/upskill', label: 'Online Courses' },
  { link: '/authentication', label: 'Admin'},
  
  // Add more links as needed
];

const articleData = {
  image: 'path/to/image.jpg',
  category: 'News',
  title: 'Lorem ipsum dolor sit amet',
  date: 'July 9, 2023',
  author: {
    name: 'John Doe',
    avatar: 'path/to/avatar.jpg',
  },
};


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

const Upskill: React.FC = () => {
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
        Online Courses
      </Title>

      <Grid gutter="md">
        <Grid.Col span={12}>
          <ArticleCardVertical {...articleData} />
        </Grid.Col>
      </Grid>
      
      <FooterLinks data={footerLinks} />
    </div>
  );
};

export default Upskill;
