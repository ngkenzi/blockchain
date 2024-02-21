import React from "react";
import { useRouter } from "next/router";
import styles from "./styles.module.css";

const Navbar = () => {
  const router = useRouter();

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
        {/* <span
          className={styles.navLink}
          onClick={() => router.push("/companies")}
        >
          companies
        </span> */}
        <span
          className={styles.navLink}
          onClick={() => router.push("/students")}
        >
          students
        </span>
      </div>
      <span
        className={styles.loginLink}
        onClick={() => router.push("/user/login")}
      >
        Login {">"}
      </span>
    </div>
  );
};

export default Navbar;
