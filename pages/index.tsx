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
      <div
        style={{
          minHeight: "70vh",
          backgroundImage: 'url("/assets/what_we_do_bg.png")',
          backgroundSize: "100% 100%",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
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
            display: "flex",
            justifyContent: "center",
            flexDirection: "column",
          }}
        >
          <div
            style={{
              color: "white",
              fontWeight: "900",
              fontSize: "43px",
              letterSpacing: "2px",
              opacity: "80%",
              display: "flex",
              justifyContent: "center",
              flexDirection: "column",
              padding: "0 150px",
            }}
          >
            <div
              style={{
                alignSelf: "center",
                padding: "80px 0 40px 0",
              }}
            >
              <span style={{ color: "#9A30DB" }}>OUR</span>
              <span> CUSTOMERS</span>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              {/* Motive for Users */}
              <div
                style={{
                  width: "33%",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <img
                  src="/assets/medal.png"
                  alt="Description of Image"
                  style={{
                    maxWidth: "50%",
                    maxHeight: "50%",
                    transform: "scale(0.5)",
                  }}
                />
                <div
                  style={{
                    fontSize: "15px",
                    fontWeight: "400",
                    padding: "10px",
                    textAlign: "center",
                    letterSpacing: "1px",
                    opacity: "73%",
                    fontFamily: "Kanit",
                  }}
                >
                  <p>
                    <strong>Users</strong>
                  </p>
                  <p>
                    Empower yourself with verifiable{" "}
                    <strong>digital twins</strong> of your certifications,
                    corporate rankings, and skillsets. Whether you're a
                    professional, student, or individual looking to showcase
                    your abilities, learn how BeingU can help you stand out in a
                    competitive <strong>Web3 landscape</strong>.
                  </p>
                </div>
              </div>
              {/* Motive for Organisations */}
              <div
                style={{
                  width: "33%",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <img
                  src="/assets/medal.png"
                  alt="Description of Image"
                  style={{
                    maxWidth: "50%",
                    maxHeight: "50%",
                    transform: "scale(0.5)",
                  }}
                />
                <div
                  style={{
                    fontSize: "15px",
                    fontWeight: "400",
                    padding: "10px",
                    textAlign: "center",
                    letterSpacing: "1px",
                    opacity: "73%",
                    fontFamily: "Kanit",
                  }}
                >
                  <p>
                    <strong>Organisations</strong>
                  </p>
                  <p>
                    Streamline your corporate structure, training processes and
                    enhance in-house credibility with BeingU for organisations.
                    Discover how our platform empowers seamless integration,
                    ease of verification and authentication of prospective
                    employees in our secured ecosystem.
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
