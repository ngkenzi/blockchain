import Head from 'next/head';
import { HeaderResponsive } from '../components/Header';
import { FooterLinks } from '../components/Footer';
import { Title} from '@mantine/core';
import { chunkArray } from '../utils'; 
import CourseTabs  from '../components/CourseTab';

const links = [
  { link: '/', label: 'Home' },
  { link: '/upskill', label: 'Online Courses' },
  { link: '/authentication', label: 'Admin'},
  // Add more links as needed
];

const courses = [
  {
    imageUrl: "https://titan.mdec.my/wp-content/uploads/Screen-Shot-2021-10-08-at-11.49.02-AM.png",
    altText: "Course 1",
    courseTitle: "Enterprise Development Programme",
    onSale: true,
    description: "Minimise skill gaps in the digital creative content industry through skill development and up-skill programmes",
    buttonLabel: "Start Course",
  },
  {
    imageUrl: "https://titan.mdec.my/wp-content/uploads/assets/images/pages/index/gfx/thumb-erezeki.jpg",
    altText: "Course 2",
    courseTitle: "eRezeki Programme",
    onSale: true,
    description: "Learn via online modules to onboard at various sharing economy platforms and earn additional income.",
    buttonLabel: "Start Course",
  },
  {
    imageUrl: "https://titan.mdec.my/wp-content/uploads/gettyimages-1194657255-170667a.jpg",
    altText: "Course 3",
    courseTitle: "Facebook Digital Marketing Certification",
    onSale: true,
    description: "You will learn about Facebook Advertising Fundamentals, Create and Manage Ads and Reporting.",
    buttonLabel: "Start Course",
  },
  {
    imageUrl: "https://titan.mdec.my/wp-content/uploads/assets/images/pages/index/gfx/thumb-glow.jpg",
    altText: "Course 4",
    courseTitle: "GLOW Programme",
    onSale: true,
    description: "Learn how to pitch and win global freelance jobs and earn income as digital freelancers",
    buttonLabel: "Start Course",
  },
  {
    imageUrl: "https://titan.mdec.my/wp-content/uploads/image45-f.jpg",
    altText: "Course 5",
    courseTitle: "Go-eCommerce Platform",
    onSale: false,
    description: "Malaysian businesses and entrepreneurs can access up to a 100 online eCommerce certifications for free.",
    buttonLabel: "Start Course",
  },
  {
    imageUrl: "https://titan.mdec.my/wp-content/uploads/Thumbnail-Cloud-Administration-No-Logo.png",
    altText: "Course 6",
    courseTitle: "Google Cloud",
    onSale: false,
    description: "Learn how to solve real-world problems with cloud knowledge",
    buttonLabel: "Start Course",
  },
  {
    imageUrl: "https://titan.mdec.my/wp-content/uploads/google.jpeg",
    altText: "Course 7",
    courseTitle: "Grow with Google",
    onSale: false,
    description: "Free training and tools to help you grow your skills, career, or business",
    buttonLabel: "Start Course",
  },
  {
    imageUrl: "https://titan.mdec.my/wp-content/uploads/Thumbnail-AWS-Certified-Cloud-Practitioner-and-SysOps-Administrator.png",
    altText: "Course 8",
    courseTitle: "IBM SkillsBuild",
    onSale: false,
    description: "Designed for students, educators, and job seekers, learners can build skills while preparing for entry-level jobs.",
    buttonLabel: "Start Course",
  },
  {
    imageUrl: "https://titan.mdec.my/wp-content/uploads/Microsoft-logo_rgb_c-gray-1.png",
    altText: "Course 9",
    courseTitle: "Microsoft Learn – Enterprise Skills Initiative",
    onSale: false,
    description: "ESI sharpens technical expertise on Microsoft platforms/ solutions through trainings and certifications.",
    buttonLabel: "Start Course",
  },
  {
    imageUrl: "https://titan.mdec.my/wp-content/uploads/2022/09/Logo-Red_Hat-A-Standard-Pantone.jpg",
    altText: "Course 10",
    courseTitle: "Red Hat Free Course",
    onSale: false,
    description: "Learners will experience hands-on training and practical certification path to fit their business goals.",
    buttonLabel: "Start Course",
  },
  {
    imageUrl: "https://titan.mdec.my/wp-content/uploads/tom-parkes-Ns-BIiW_cNU-unsplash.jpg",
    altText: "Course 11",
    courseTitle: "Skillshop - Google Ads Certification",
    onSale: false,
    description: "Master Google Ads with free online training and get Google Ads certified.",
    buttonLabel: "Start Course",
  },
  {
    imageUrl: "https://titan.mdec.my/wp-content/uploads/Webp.net-resizeimage-49.png",
    altText: "Course 12",
    courseTitle: "Surface Your Creds (SYC)",
    onSale: false,
    description: "Update skills on LinkedIn profile to join SYC and learn how to increase your marketability.",
    buttonLabel: "Start Course",
  },
  // More course objects...
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

const Upskill: React.FC = () => {
  const chunkedCourses = chunkArray(courses, 3);

  return (
    <div>
      <Head>
        <title>Online Courses</title>
        <meta name="description" content="Upskill yourself today with MDEC " />
      </Head>
      
      <HeaderResponsive links={links} />
      <Title 
        order={3} 
        style={{
          fontWeight: 'bold',
          marginTop: '20px',
          marginBottom: '20px' // change this to whatever value you need
        }} 
        align="center"
      >
        Online Courses
      </Title>
      <CourseTabs courses={courses} />

      

      <FooterLinks data={footerLinks} />
    </div>
  );
};

export default Upskill;
