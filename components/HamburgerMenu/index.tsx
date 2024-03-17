import React, { useEffect, useState } from "react";
import styles from "./styles.module.css";
import { useRouter } from "next/router";

const HamburgerMenu = () => {
  const [isSliderOpen, setIsSliderOpen] = useState(false);
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const toggleSlider = () => {
    setIsSliderOpen(!isSliderOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    router.push("/");
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
  }, []);

  return (
    <>
      <div className={styles.navbar}>
        <div className={styles.icon} onClick={toggleSlider}>
          <img src="/images/hamburger_menu.png" alt="Menu"></img>
        </div>
        <div className={styles.beingu_logo}>
          <img src="images/logo.png" />
        </div>
      </div>
      <div
        className={`${styles.slider} ${isSliderOpen ? styles.sliderOpen : ""}`}
      >
        <div className={styles.close_icon} onClick={toggleSlider}>
          <img src="/images/close.png" alt="Close"></img>
        </div>
        <div className={styles.menu_items}>
          <p className={styles.nav_link} onClick={() => router.push("/")}>
            home
          </p>
          <p className={styles.nav_link} onClick={() => router.push("/search")}>
            search
          </p>
          <p
            className={styles.nav_link}
            onClick={() => router.push("/companies")}
          >
            companies
          </p>
          <p
            className={styles.nav_link}
            onClick={() => router.push("/students")}
          >
            students
          </p>
          {isAuthenticated ? (
            <>
              <p
                className={styles.navLink}
                onClick={() => router.push("/profile")}
              >
                profile
              </p>
              <p className={styles.loginLink} onClick={handleLogout}>
                Logout {">"}
              </p>
            </>
          ) : (
            <p
              className={styles.loginLink}
              onClick={() => router.push("/user/login")}
            >
              Login {">"}
            </p>
          )}
        </div>
      </div>
    </>
  );
};

export default HamburgerMenu;
