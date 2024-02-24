import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import styles from "./style.module.css";

const SelfAssessmentCTA = () => {
  const router = useRouter();
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (!visible) {
      const timeoutId = setTimeout(() => setVisible(false), 500);
      return () => clearTimeout(timeoutId); // Cleanup function for unmounted component
    }
  }, [visible]);

  const handleCTAClick = () => router.push("/assessment");

  const handleClose = () => setVisible(false);

  return (
    <div className={`${styles.banner} ${!visible && styles.slideDown}`}>
      <span>
        Level up job opportunities with your 1st self-assessment cert today
      </span>
      <div className={styles.button_container}>
        <button onClick={handleCTAClick}>Start Self-Assessment</button>
        <button onClick={handleClose}>Close</button>
      </div>
    </div>
  );
};

export default SelfAssessmentCTA;
