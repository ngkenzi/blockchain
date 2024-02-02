import React, { useState, useEffect } from "react";
import Head from "next/head";
import { Title, Text, Button } from "@mantine/core";
import { HeaderResponsive } from "../components/Header";
import { FooterLinks } from "../components/Footer";
import SelfAssessmentCTA from "../components/SelfAssessmentCTA";
import Layout from "./Layout";
import { useRouter } from "next/router";
import { Carousel } from "react-responsive-carousel";
import { FaAward, FaCogs, FaUserSecret } from "react-icons/fa";

import "react-responsive-carousel/lib/styles/carousel.min.css";

const ServiceCard = ({ Icon, title, description }) => (
  <div className="flex flex-col items-center p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out h-60 md:h-auto">
    <Icon className="w-16 h-16 text-blue-600 mb-4" />
    <h3 className="text-lg font-semibold mb-2 text-center">{title}</h3>
    <p className="text-sm text-gray-600 text-center flex-grow">{description}</p>
  </div>
);

const Home = () => {
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [isSubmissionStatusLoaded, setIsSubmissionStatusLoaded] =
    useState(false);

  const router = useRouter();

  const checkSubmission = async () => {
    try {
      const userWAddress = localStorage.getItem("walletAddress");
      const response = await fetch(
        `/api/checkSubmissionStatus?walletAddress=${userWAddress}`
      );
      const data = await response.json();

      if (data.exists) {
        setHasSubmitted(true);
      }
      setIsSubmissionStatusLoaded(true);
    } catch (error) {
      console.error("Error checking submission status:", error);
      setIsSubmissionStatusLoaded(true);
    }
  };

  useEffect(() => {
    checkSubmission();
  }, []);

  return (
    <Layout
      title="Home"
      description="Verify and Validate your certificates with MSP Cert"
    >
      <Head>
        <title>Home</title>
        <meta
          name="description"
          content="Verify and Validate your certificates with MSP Cert"
        />
      </Head>
      <div className="flex-grow container mx-auto p-4 sm:p-8 max-w-7xl">
        {/* Hero Section */}
        <div className="flex flex-col lg:mt-0 mt-10 lg:flex-row items-center justify-center min-h-screen px-6 lg:px-8">
          <div className="mx-auto max-w-7xl lg:flex lg:items-center lg:justify-between">
            {/* Text Section */}
            <div className="text-center lg:text-left lg:w-1/2">
              <h1 className="text-4xl font-extrabold text-gray-800 sm:text-6xl">
                Empowering Certification with Blockchain
              </h1>
              <p className="mt-8 text-xl text-gray-600">
                Utilize the power of blockchain to secure and simplify your
                certification processes
              </p>

              {/* Powered by MSP Section */}
              <div className="mt-8 inline-flex items-center justify-center lg:justify-start">
                <span className="text-gray-600 align-middle">Powered by</span>
                <img
                  src="/assets/MSPSystems.png"
                  alt="MSP Icon"
                  className="ml-2 w-24 h-12 align-middle"
                />
                <img
                  src="/assets/polygon-logo-colored.svg"
                  alt="Polygon Logo"
                  className="ml-2 w-30 h-10 align-middle"
                />
              </div>

              <div className="mt-12 flex justify-center lg:justify-start gap-6">
                <button
                  onClick={() => router.push("/user/register")}
                  className="px-5 py-3 lg:text-lg font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                >
                  Get Started
                </button>
                {/* <button className="px-6 py-3 lg:text-lg font-semibold text-blue-600 bg-transparent border-2 border-blue-600 rounded-md hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50">
                Learn More
              </button> */}
                <button
                  onClick={() => router.push("/assessment")}
                  className="px-4 py-3 lg:text-lg font-semibold text-white bg-green-600 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
                >
                  Claim Job Tokens
                </button>
              </div>
            </div>

            {/* Image Section */}
            <div className="mt-12 lg:mt-0 lg:ml-8 lg:w-1/2">
              <img
                src="/assets/banner.png"
                alt="Descriptive Alt Text"
                className="w-full h-auto rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>

        {/* What We Do Section */}
        <section className="py-12 bg-gray-100">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
              What We Do
            </h2>
            <Carousel
              showArrows={true}
              showThumbs={false}
              showStatus={false}
              infiniteLoop
              useKeyboardArrows
              autoPlay
              interval={5000}
              transitionTime={350}
              emulateTouch
              swipeable
              dynamicHeight={false}
              className="md:hidden"
              showIndicators={true}
              renderIndicator={(onClickHandler, isSelected, index, label) => {
                const style = isSelected
                  ? {
                      background: "#000",
                      width: 8,
                      height: 8,
                      display: "inline-block",
                      margin: "0 8px",
                      borderRadius: "50%",
                    }
                  : {
                      background: "#ccc",
                      width: 8,
                      height: 8,
                      display: "inline-block",
                      margin: "0 8px",
                      borderRadius: "50%",
                    };
                return (
                  <button
                    type="button"
                    style={style}
                    onClick={onClickHandler}
                    onKeyDown={onClickHandler}
                    key={index}
                    title={`${label} ${index + 1}`}
                    aria-label={`${label} ${index + 1}`}
                  />
                );
              }}
            >
              <ServiceCard
                Icon={FaAward}
                title="Simplify Your Certification Processes"
                description="Leverage blockchain technology for secure and efficient certification management."
              />
              <ServiceCard
                Icon={FaCogs}
                title="Innovative Solutions"
                description="Implement cutting-edge technology to enhance operational efficiency."
              />
              <ServiceCard
                Icon={FaUserSecret}
                title="User Privacy Protection"
                description="Ensure the utmost privacy and security for user data."
              />
            </Carousel>
            <div className="hidden md:grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              {/* Grid layout visible on medium and larger screens */}
              <ServiceCard
                Icon={FaAward}
                title="Simplify Your Certification Processes"
                description="Leverage blockchain technology for secure and efficient certification management."
              />
              <ServiceCard
                Icon={FaCogs}
                title="Innovative Solutions"
                description="Implement cutting-edge technology to enhance operational efficiency."
              />
              <ServiceCard
                Icon={FaUserSecret}
                title="User Privacy Protection"
                description="Ensure the utmost privacy and security for user data."
              />
            </div>
          </div>
        </section>
      </div>

      {isSubmissionStatusLoaded && !hasSubmitted && <SelfAssessmentCTA />}
    </Layout>
  );
};

export default Home;
