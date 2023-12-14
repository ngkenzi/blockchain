import { useState } from "react";
import { Button, Text, ActionIcon } from "@mantine/core";
import { useRouter } from "next/router";
import { FaTimes } from "react-icons/fa"; 

const SelfAssessmentCTA = () => {
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(true);

  const handleCTAClick = () => {
    router.push("/assessment");
  };

  const handleClose = () => {
    setIsVisible(false);
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div
      style={{
        position: "fixed",
        bottom: 0,
        width: "100%",
        backgroundColor: "#f8f9fa",
        padding: "10px",
        boxShadow: "0px -2px 10px rgba(0, 0, 0, 0.1)",
      }}
    >
      <div style={{ position: "relative", textAlign: "center" }}>
        {/* Close Button */}
        <ActionIcon
          style={{
            position: "absolute",
            right: "10px",
            top: "10px",
          }}
          onClick={handleClose}
        >
          <FaTimes />
        </ActionIcon>

        <Text>
          Level up job opportunities with your 1st self-assessment cert today
        </Text>
        <Button onClick={handleCTAClick}>Start Self-Assessment</Button>
      </div>
    </div>
  );
};

export default SelfAssessmentCTA;
