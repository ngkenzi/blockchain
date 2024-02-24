import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import styles from "./style.module.css";

const SelfAssessmentCTA = () => {
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(true);
  const [hideCompletely, setHideCompletely] = useState(false);

  useEffect(() => {
    if (!isVisible) {
      setTimeout(() => {
        setHideCompletely(true);
      }, 500);
    }
  }, [isVisible]);

  const handleCTAClick = () => {
    router.push("/assessment");
  };

  const handleClose = () => {
    setIsVisible(false);
  };

  return (
    <>
      {!hideCompletely && (
        <div
          className={`${styles.banner} ${!isVisible ? styles.slideDown : ""}`}
        >
          <span>
            Level up job opportunities with your 1st self-assessment cert today
          </span>
          <div className={styles.button_container}>
            <button onClick={handleCTAClick}>Start Self-Assessment</button>
            <button onClick={handleClose}>Close</button>
          </div>
        </div>
      )}
    </>
  );
};

export default SelfAssessmentCTA;
