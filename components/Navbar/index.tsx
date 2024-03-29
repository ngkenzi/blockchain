import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import styles from "./styles.module.css";

const Navbar = () => {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [isSubmissionStatusLoaded, setIsSubmissionStatusLoaded] =
    useState(false);

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
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    router.push("/");
  };

  return (
    <div className={styles.navbar}>
      <span>
        <img className={styles.beingu_logo} src="/images/logo.png" />
      </span>
      <div>
        <span className={styles.navLink} onClick={() => router.push("/")}>
          home
        </span>
        <span className={styles.navLink} onClick={() => router.push("/search")}>
          search
        </span>
        <span
          className={styles.navLink}
          onClick={() => router.push("/companies")}
        >
          companies
        </span>
        <span
          className={styles.navLink}
          onClick={() => router.push("/students")}
        >
          students
        </span>
      </div>
      {isAuthenticated ? (
        <>
          <span
            className={styles.navLink}
            onClick={() => router.push("/profile")}
          >
            profile
          </span>
          <span className={styles.loginLink} onClick={handleLogout}>
            Logout {">"}
          </span>
        </>
      ) : (
        <span
          className={styles.loginLink}
          onClick={() => router.push("/user/login")}
        >
          Login {">"}
        </span>
      )}
    </div>
  );
};

export default Navbar;
