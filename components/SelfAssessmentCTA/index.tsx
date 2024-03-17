import { useState } from "react";
import { useRouter } from "next/router";
import styles from "./style.module.css";

const SelfAssessmentCTA = () => {
  const router = useRouter();
  const [visible, setVisible] = useState(true);

  const handleCTAClick = () => router.push("/assessment");

  const handleClose = () => setVisible(false);

  return (
    visible && (
      <div className={styles.banner}>
        <span>
          Level up job opportunities with your 1st self-assessment cert today
        </span>
        <div className={styles.button_container}>
          <button onClick={handleCTAClick}>Start Self-Assessment</button>
          <button onClick={handleClose}>Close</button>
        </div>
      </div>
    )
  );
};

export default SelfAssessmentCTA;
