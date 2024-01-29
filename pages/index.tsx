import React, { useState, useEffect } from "react";
import Head from "next/head";
import { Title, Text, Button, Flex } from "@mantine/core";
import { HeaderResponsive } from "../components/Header";
import { FooterLinks } from "../components/Footer";
import SelfAssessmentCTA from "../components/SelfAssessmentCTA";
import Layout from "./Layout";
import { useRouter } from "next/router";
import { Carousel } from "react-responsive-carousel";
import { FaAward, FaCogs, FaUserSecret } from "react-icons/fa";

import "react-responsive-carousel/lib/styles/carousel.min.css";
import { color } from "html2canvas/dist/types/css/types/color";

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
    <>
      <div
        className="homepage_container"
        style={{
          backgroundImage: 'url("/assets/homepage_bg.png")',
          backgroundSize: "100% 100%",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          minHeight: "100vh",
        }}
      >
        <section
          style={{
            padding: "0 150px",
            display: "flex",
            justifyContent: "center",
            flexDirection: "column",
            height: "90vh",
          }}
        >
          <div
            className="homepage_navbar"
            style={{
              display: "flex",
              justifyContent: "space-between",
              color: "white",
              opacity: "70%",
              textTransform: "uppercase",
              padding: "10px 0px",
              fontFamily: "Kanit, sans-serif",
              fontSize: "10px",
              fontStyle: "normal",
              letterSpacing: "2px",
              borderBottom: "2px solid rgba(255, 255, 255, 0.41)",
            }}
          >
            <span>BEINGU</span>
            <div>
              <span
                style={{
                  paddingRight: "39px",
                }}
              >
                home
              </span>
              <span
                style={{
                  paddingRight: "39px",
                }}
              >
                search
              </span>
              <span
                style={{
                  paddingRight: "39px",
                }}
              >
                companies
              </span>
              <span
                style={{
                  paddingRight: "39px",
                }}
              >
                students
              </span>
            </div>
            <span>Login {">"}</span>
          </div>
          <div
            className="intro"
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              height: "100%",
            }}
          >
            <div
              className="upper_content"
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                textAlign: "center",
                color: "white",
                opacity: "70%",
                textTransform: "uppercase",
                padding: "10px 0px",
                fontFamily: "Kanit, sans-serif",
                fontSize: "16px",
                fontStyle: "normal",
                letterSpacing: "2px",
                marginTop: "76px",
                maxWidth: "80%",
                alignSelf: "center",
              }}
            >
              <p>WELCOME TO BEINGU</p>
              <p
                style={{
                  fontSize: "44px",
                  fontWeight: "900",
                  opacity: "100%",
                  paddingTop: "30px",
                }}
              >
                Future of Web3 and Blockchains.
              </p>
            </div>
            <div
              className="lower_content"
              style={{
                alignSelf: "center",
                display: "flex",
                flexDirection: "column",
                maxWidth: "80%",
                gap: "30px",
              }}
            >
              <div
                style={{ alignSelf: "center", display: "flex", gap: "130px" }}
              >
                <button
                  style={{
                    borderColor: "rgba(255, 255, 255, 0.6)",
                    borderWidth: "1px",
                    borderStyle: "solid",
                    backgroundColor: "rgba(10, 0, 29, 0.6)",
                    color: "white",
                    padding: "10px 20px",
                    fontSize: "16px",
                    borderRadius: "10px",
                    cursor: "pointer",
                    minWidth: "170px",
                    fontFamily: "Kanit, sans-serif",
                  }}
                >
                  Get Started
                </button>
                <button
                  style={{
                    borderColor: "rgba(255, 255, 255, 0.6)",
                    borderWidth: "1px",
                    borderStyle: "solid",
                    backgroundColor: "rgba(10, 0, 29, 0.6)",
                    color: "white",
                    padding: "10px 20px",
                    fontSize: "16px",
                    borderRadius: "10px",
                    cursor: "pointer",
                    minWidth: "170px",
                    fontFamily: "Kanit, sans-serif",
                  }}
                >
                  Claim Job Token
                </button>
              </div>
              <p
                style={{ color: "white", opacity: "73%", textAlign: "center" }}
              >
                In publishing and graphic design, Lorem ipsum is a placeholder
                text commonly used to demonstrate the visual form of a document
                or a typeface without relying on meaningful content. Lorem ipsum
                may be use as a placeholder before final copy is available.
              </p>
            </div>
          </div>
        </section>
      </div>
      <div
        style={{
          height: "100vh",
          backgroundImage: 'url("/assets/what_we_do_bg.png")',
          backgroundSize: "100% 100%",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          minHeight: "100vh",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.7)",
          }}
        >
          <div
            className="what_we_do_content"
            style={{
              color: "white",
              fontWeight: "900",
              fontSize: "43px",
              letterSpacing: "2px",
              opacity: "80%",
              display: "flex",
              justifyContent: "center",
              flexDirection: "column",
            }}
          >
            <div className="title" style={{ alignSelf: "center" }}>
              <span style={{ color: "#9A30DB" }}>WHAT</span>
              <span> WE DO</span>
            </div>

            <div>
              <img
                src="/assets/medal.png"
                alt="Description of Image"
                style={{
                  maxWidth: "100%" /* Scale image based on width */,
                  maxHeight: "100%" /* Control the height */,
                  transform: "scale(0.2)",
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
