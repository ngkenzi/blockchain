import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import Navbar from "../components/Navbar";
import styles from "./index.module.css";

const Home = () => {
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [isSubmissionStatusLoaded, setIsSubmissionStatusLoaded] =
    useState(false);

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
  }, []);

  return (
    <>
      <div className={styles.homepage_container}>
        <section>
          <Navbar />
          <div className={styles.intro}>
            <div className={styles.upper_content}>
              <p>WELCOME TO BEINGU</p>
              <p>Future of Web3 and Blockchains.</p>
            </div>
            <div className={styles.lower_content}>
              <div>
                <button onClick={() => router.push("/user/register")}>
                  Get Started
                </button>
                <button onClick={() => router.push("/assessment")}>
                  Claim Job Token
                </button>
              </div>
              <p>
                In publishing and graphic design, Lorem ipsum is a placeholder
                text commonly used to demonstrate the visual form of a document
                or a typeface without relying on meaningful content. Lorem ipsum
                may be use as a placeholder before final copy is available.
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
                <p>Simplify your certification process</p>
                <p className={styles.motive_desc} style={{}}>
                  Leverage blockchain technology for secure and efficient
                  certification management
                </p>
              </div>
              <div className={styles.motive}>
                <img src="/assets/medal.png" alt="Description of Image" />
                <p>Simplify your certification process</p>
                <p className={styles.motive_desc}>
                  Leverage blockchain technology for secure and efficient
                  certification management
                </p>
              </div>
              <div className={styles.motive}>
                <img src="/assets/medal.png" alt="Description of Image" />
                <p>Simplify your certification process</p>
                <p className={styles.motive_desc}>
                  Leverage blockchain technology for secure and efficient
                  certification management
                </p>
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
          <img src="/assets/MSPSystems.png" />
          <img
            src="assets/polygon-logo-colored.svg"
            style={{
              background: "white",
              padding: "40px",
              borderRadius: "30px",
              opacity: "80%",
            }}
          />
        </div>
        <hr />
      </div>
    </>
  );
};

export default Home;
