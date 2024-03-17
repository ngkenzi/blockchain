import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import styles from "./styles.module.css";
import ProfilePicture from "../ProfilePicture/index";

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
      <div className={styles.menu_items}>
        <button onClick={() => router.push("/")}>Home</button>
        <button onClick={() => router.push("/")}>Search</button>
        <button onClick={() => router.push("/")}>Companies</button>
        <button onClick={() => router.push("/")}>Students</button>
      </div>
      {isAuthenticated && <ProfilePicture />}
    </div>
  );
};

export default Navbar;
