import { useState } from "react";
import { Button, Text } from "@mantine/core";
import { useRouter } from "next/router";

const SelfAssessmentCTA = () => {
  const router = useRouter();

  const handleCTAClick = () => {
    router.push("/assessment");
  };
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
      <div style={{ textAlign: "center" }}>
        <Text>
          Level up job opportunities with your 1st self-assessment cert today
        </Text>
        <Button onClick={handleCTAClick}>Start Self-Assessment</Button>
      </div>
    </div>
  );
};

export default SelfAssessmentCTA;
