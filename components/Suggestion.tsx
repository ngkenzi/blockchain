import { Center, SegmentedControl, Box, Paper, Title, TypographyStylesProvider, Skeleton } from "@mantine/core";
import { IconArrowBigUpLine, IconArrowDown, IconGraph, IconHeartPlus } from "@tabler/icons-react";
import { useState, useEffect } from "react";
import { insights } from "../mock/insights";

function SuggestionPaper() {
  const [selectedValue, setSelectedValue] = useState("cost");
  const [generatedAdvice, setGeneratedAdvice] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      if (selectedValue !== "")
        setGeneratedAdvice(insights[selectedValue]);
      setLoading(false);
    }, 2000); // Simulating a delay to showcase the loading effect
  }, [selectedValue]);

  return (
    <Paper p="lg" shadow="sm">
      <Title order={5} mb="md">
        Hydroculture Advice
      </Title>
      <SegmentedControl
        mb="lg"
        value={selectedValue}
        onChange={(value) => setSelectedValue(value)}
        data={[
          {
            value: "nutrients",
            label: (
              <Center>
                <IconArrowDown size="1rem" />
                <Box ml={10}>Nutrients</Box>
              </Center>
            ),
          },
          {
            value: "water",
            label: (
              <Center>
                <IconGraph size="1rem" />
                <Box ml={10}>Water</Box>
              </Center>
            ),
          },
          {
            value: "light",
            label: (
              <Center>
                <IconHeartPlus size="1rem" />
                <Box ml={10}>Light</Box>
              </Center>
            ),
          },
        ]}
      />
      <Paper withBorder p="lg">
        <TypographyStylesProvider>
          <Skeleton visible={loading}>
            <div dangerouslySetInnerHTML={{ __html: generatedAdvice }} />
          </Skeleton>
        </TypographyStylesProvider>
      </Paper>
    </Paper>
  );
}

export default SuggestionPaper;
