import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import Navbar from "../components/Navbar";
import styles from "./index.module.css";
import HamburgerMenu from "../components/HamburgerMenu";
import { Button } from "@mantine/core";

const Home = () => {
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [isSubmissionStatusLoaded, setIsSubmissionStatusLoaded] =
    useState(false);
  const [windowWidth, setWindowWidth] = useState(undefined);
  const router = useRouter();

  const checkSubmission = async () => {
    try {
      const userWAddress = localStorage.getItem("walletAddress");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/checkSubmissionStatus?walletAddress=${userWAddress}`
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
    setWindowWidth(window.innerWidth);
  }, []);

  return (
    <>
      <div className={styles.body}>
        <div className={styles.homepage_container}>
          <section>
            {windowWidth <= 600 && windowWidth >= 375 ? (
              <HamburgerMenu />
            ) : (
              <Navbar />
            )}
            <div className={styles.intro}>
              <div className={styles.upper_content}>
                <p>WELCOME TO BEINGU</p>
                <p>Being True to Yourself</p>
              </div>
              <div className={styles.lower_content}>
                <div className={styles.button_container}>
                  <button onClick={() => router.push("/user/register")}>
                    Get Started
                  </button>
                  <button onClick={() => router.push("/assessment")}>
                    Claim Job Token
                  </button>
                </div>
                <p>
                  Welcome to BeingU, where blockchain technology meets
                  certification. Explore how we're revolutionising the
                  certification process to create secure digital twins of your
                  credentials corporate profile, and accomplishments.
                </p>
              </div>
            </div>
          </section>
        </div>
        <div className={styles.about_us_bg}>
          <div className={styles.overlay}>
            <div className={styles.content}>
              <p>ABOUT US</p>
              <p className={styles.aboutus_desc}>
                At BeingU, we're passionate about leveraging blockchain
                technology to enhance trust, transparency, and security.
              </p>
              <Button>
                Learn more about our mission, vision, and the team behind the
                platform
              </Button>
            </div>
          </div>
        </div>
        <div className={styles.planet}>
          <div className={styles.container}>
            <div className={styles.user_org}>
              <div className="user">
                <p className={styles.title}>+ For Users</p>
                <p className={styles.desc}>
                  Empower yourself with verifiable digital twins of your
                  certifications, corporate rankings, and skillsets. Whether
                  you're a professional, student, or individual looking to
                  showcase your abilities, learn how BeingU can help you stand
                  out in a competitive Web3 landscape.
                </p>
              </div>
              <div className={styles.enterprise}>
                <p className={styles.title}>+ For Enterprise</p>
                <p className={styles.desc}>
                  Empower yourself with verifiable digital twins of your
                  certifications, corporate rankings, and skillsets. Whether
                  you're a professional, student, or individual looking to
                  showcase your abilities, learn how BeingU can help you stand
                  out in a competitive Web3 landscape.
                </p>
              </div>
            </div>
            <div className={styles.howitworks}>
              <p className={styles.title}>HOW IT WORKS</p>
              <p className={styles.desc}>
                From creation to verification, understand the seamless process
                utilised to create immutable digital twins of your
                certifications to go along with your virtual avatar
              </p>
            </div>
          </div>
          <div className={styles.features}>
            <p className={styles.title}>FEATURES</p>
            <div className={styles.grid}>
              <div className={styles.item}>
                <p>Portability</p>
                <p>
                  Discover how easy it is to access and share your competencies
                  and achievements securely anytime, anywhere.
                </p>
              </div>
              <div className={styles.item}>
                <p>Transparency</p>
                <p>
                  Discover how easy it is to access and share your competencies
                  and achievements securely anytime, anywhere.
                </p>
              </div>
              <div className={styles.item}>
                <p>Empowerment</p>
                <p>
                  Discover how easy it is to access and share your competencies
                  and achievements securely anytime, anywhere.
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className={styles.poweredby}>
          <div className={styles.title}>
            <p>POWERED BY</p>
          </div>
          <div className={styles.logo_container}>
            <a href="https://mspsys.com/" target="_blank">
              <img src="/assets/MSPSystems.png" />
            </a>
            <a href="https://polygon.technology/" target="_blank">
              <img src="assets/polygon-logo-colored.svg" />
            </a>
          </div>
          <hr className="bottom_line" />
        </div>
      </div>
    </>
  );
};

export default Home;
