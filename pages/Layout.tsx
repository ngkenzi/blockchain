import Head from 'next/head';
import { ReactNode, useState } from 'react';
import { HeaderResponsive } from "../components/Header";
import { FooterLinks } from "../components/Footer";
import Link from 'next/link';
import { FaUniversity, FaUser } from 'react-icons/fa';

interface Props {
  title: string;
  description: string;
  children: ReactNode;
}

const Layout = ({ title, description, children }: Props) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [actionType, setActionType] = useState<"SignIn" | "SignUp">("SignUp");
  const links = [
    { link: "/", label: "Home" },

    // { link: "/upskill", label: "Online Courses" },
    // { link: "/authentication", label: "Admin" },
    // { link: "/university", label: "University" },
    // Add more links as needed
  ];
  const footerLinks = [
    {
      title: "Company",
      links: [
        { label: "About", link: "/about" },
        // Add more links as needed
      ],
    },
    // Add more groups as needed
  ];

  const toggleModal = (action: "SignIn" | "SignUp") => {
    setActionType(action);
    setIsModalOpen(!isModalOpen);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
      </Head>
      
      <HeaderResponsive links={links} toggleModal={toggleModal} />
      <main className="flex-grow">
        {children}
      </main>

      {isModalOpen && (
            <div className="fixed inset-0 flex items-center justify-center z-50 transition-all duration-300">
              <div
                className="fixed inset-0 bg-black opacity-40 transition-opacity duration-300 ease-in-out"
                onClick={toggleModal}
                style={{ zIndex: 100 }}
              ></div>
              <div
                className="bg-white p-8 rounded-xl shadow-2xl relative transform transition-transform duration-300 ease-in-out"
                style={{ zIndex: 101, width: "450px" }}
              >
                <h2 className="text-2xl font-semibold mb-6 text-gray-800 text-center">
                  {actionType === "SignUp" ? "Sign Up As" : "Sign In As"}
                </h2>
                <div className="mt-5 flex justify-center space-x-6">
                  <Link
                    href={actionType === "SignUp" ? "/Signup" : "/Login"}
                    className="flex flex-col items-center space-y-4 p-6 transition-all transform hover:bg-gray-100 hover:scale-105 rounded-xl focus:outline-none border-2 border-blue-200 rounded-lg w-56"
                  >
                    <FaUniversity size="3em" className="mb-2" />
                    <span className="text-lg font-semibold text-blue-600">
                      Universities
                    </span>
                  </Link>
                  <Link
                    href={actionType === "SignUp" ? "/Uregister" : "/Ulogin"}
                    className="flex flex-col items-center space-y-4 p-6 transition-all transform hover:bg-gray-100 hover:scale-105 rounded-xl focus:outline-none border-2 border-blue-200 rounded-lg w-56"
                  >
                    <FaUser size="3em" className="mb-2" />
                    <span className="text-lg font-semibold text-blue-600">
                      Users
                    </span>
                  </Link>
                </div>
                <p
                  className="absolute top-3 right-3 text-lg text-gray-500 cursor-pointer"
                  onClick={toggleModal}
                >
                  Close
                </p>
              </div>
            </div>
          )}
      <FooterLinks data={footerLinks} />
    </div>
  );
};

export default Layout;
