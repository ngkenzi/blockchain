import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import Navbar from "../components/Navbar";
import styles from "./index.module.css";
import HamburgerMenu from "../components/HamburgerMenu";

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
      <div className={styles.whatwedo}>
        <div>
          <div className={styles.whatwedo_content} style={{}}>
            <div className={styles.title}>
              <span style={{ color: "#9A30DB" }}>WHAT</span>
              <span> WE DO</span>
            </div>
            <div className={styles.motive_container}>
              <div className={styles.motive}>
                <img src="/assets/medal.png" alt="Description of Image" />
                <div className={styles.motive_desc}>
                  <p>Portability</p>
                  <p>
                    Discover how easy it is to access and share your
                    competencies and achievements securely anytime, anywhere.
                  </p>
                </div>
              </div>
              <div className={styles.motive}>
                <img src="/assets/medal.png" alt="Description of Image" />
                <div className={styles.motive_desc}>
                  <p>Transparency</p>
                  <p>
                    Gain insight into the transparent verification process
                    provided by BeingU.
                  </p>
                </div>
              </div>
              <div className={styles.motive}>
                <img src="/assets/medal.png" alt="Description of Image" />
                <div className={styles.motive_desc}>
                  <p>Empowerment</p>
                  <p>
                    Find out how you can take control and shape your digital
                    future with confidence.
                  </p>
                </div>
              </div>
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
    </>
  );
};

export default Home;
