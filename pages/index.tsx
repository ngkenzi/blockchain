import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import Navbar from "../components/Navbar";

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
          <Navbar />
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
                  onClick={() => router.push("/user/register")}
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
                  onClick={() => router.push("/assessment")}
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
          height: "70vh",
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
              padding: "0 150px",
            }}
          >
            <div
              className="title"
              style={{ alignSelf: "center", padding: "80px 0 40px 0" }}
            >
              <span style={{ color: "#9A30DB" }}>WHAT</span>
              <span> WE DO</span>
            </div>
            {/* start here */}
            <div
              className="motive-container"
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div
                className="motive"
                style={{
                  width: "33%",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <img
                  src="/assets/medal.png"
                  alt="Description of Image"
                  style={{
                    maxWidth: "50%" /* Scale image based on width */,
                    maxHeight: "50%" /* Control the height */,
                    transform: "scale(0.5)",
                  }}
                />
                <p
                  style={{
                    fontSize: "18px",
                    padding: "3px",
                    textAlign: "center",
                  }}
                >
                  Simplify your certification process
                </p>
                <p
                  style={{
                    fontSize: "15px",
                    fontWeight: "400",
                    padding: "10px",
                    textAlign: "center",
                    letterSpacing: "1px",
                    opacity: "73%",
                    fontFamily: "Kanit, sans-serif",
                  }}
                >
                  Leverage blockchain technology for secure and efficient
                  certification management
                </p>
              </div>
              <div
                className="motive"
                style={{
                  width: "33%",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <img
                  src="/assets/medal.png"
                  alt="Description of Image"
                  style={{
                    maxWidth: "50%" /* Scale image based on width */,
                    maxHeight: "50%" /* Control the height */,
                    transform: "scale(0.5)",
                  }}
                />
                <p
                  style={{
                    fontSize: "18px",
                    padding: "3px",
                    textAlign: "center",
                  }}
                >
                  Simplify your certification process
                </p>
                <p
                  style={{
                    fontSize: "15px",
                    fontWeight: "400",
                    padding: "10px",
                    textAlign: "center",
                    letterSpacing: "1px",
                    opacity: "73%",
                    fontFamily: "Kanit, sans-serif",
                  }}
                >
                  Leverage blockchain technology for secure and efficient
                  certification management
                </p>
              </div>
              <div
                className="motive"
                style={{
                  width: "33%",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <img
                  src="/assets/medal.png"
                  alt="Description of Image"
                  style={{
                    maxWidth: "50%" /* Scale image based on width */,
                    maxHeight: "50%" /* Control the height */,
                    transform: "scale(0.5)",
                  }}
                />
                <p
                  style={{
                    fontSize: "18px",
                    padding: "3px",
                    textAlign: "center",
                  }}
                >
                  Simplify your certification process
                </p>
                <p
                  style={{
                    fontSize: "15px",
                    fontWeight: "400",
                    padding: "10px",
                    textAlign: "center",
                    letterSpacing: "1px",
                    opacity: "73%",
                    fontFamily: "Kanit, sans-serif",
                  }}
                >
                  Leverage blockchain technology for secure and efficient
                  certification management
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        className="poweredby"
        style={{
          backgroundColor: "black",
          height: "60vh",
          minHeight: "60vh",
          position: "relative",
          padding: "0 150px",
        }}
      >
        <div className="title">
          <p
            style={{
              color: "darkgrey",
              textAlign: "center",
              fontFamily: "sans-serif",
              fontWeight: "100",
              paddingTop: "60px",
              fontSize: "30px",
            }}
          >
            POWERED BY
          </p>
        </div>
        <div
          className="logo-container"
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <img
            src="/assets/MSPSystems.png"
            style={{
              maxWidth: "40%" /* Scale image based on width */,
              maxHeight: "40%" /* Control the height */,
              transform: "scale(0.5)",
            }}
          />
          <img
            src="assets/polygon-logo-colored.svg"
            style={{
              maxWidth: "40%" /* Scale image based on width */,
              maxHeight: "40%" /* Control the height */,
              transform: "scale(0.5)",
              background: "white",
              padding: "40px",
              borderRadius: "30px",
              opacity: "80%",
            }}
          />
        </div>
        <hr
          style={{
            backgroundColor: "white",
            opacity: "0.3",
          }}
        />
      </div>
    </>
  );
};

export default Home;
