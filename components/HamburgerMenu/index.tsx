import React, { useState } from "react";
import styles from "./styles.module.css";
import { useRouter } from "next/router";

const HamburgerMenu = () => {
  const [isSliderOpen, setIsSliderOpen] = useState(false);
  const router = useRouter();

  const toggleSlider = () => {
    setIsSliderOpen(!isSliderOpen);
  };

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
          {/* <p
            className={styles.nav_link}
            onClick={() => router.push("/companies")}
          >
            companies
          </p> */}
          <p
            className={styles.nav_link}
            onClick={() => router.push("/students")}
          >
            students
          </p>
          <p
            className={styles.nav_link}
            onClick={() => router.push("/user/login")}
          >
            login
          </p>
        </div>
      </div>
    </>
  );
};

export default HamburgerMenu;
