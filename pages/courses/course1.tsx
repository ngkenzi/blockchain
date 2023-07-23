import Head from 'next/head';
import { HeaderResponsive } from '../../components/Header';
import { FooterLinks } from '../../components/Footer';


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
const Course1: React.FC = () => {
  return (
    <div>
      <Head>
        <title>Online Courses</title>
        <meta name="description" content="Upskill yourself today with MDEC " />
      </Head>
      
      <HeaderResponsive links={links} />
      <iframe title="Online Courses" src="https://mdec.my/learn-for-free" style={{ width: '100%', height: '500px' }}/>
      <FooterLinks data={footerLinks} />
    </div>
  );
};
export default Course1;