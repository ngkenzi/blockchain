import { Paper, TypographyStylesProvider, Title } from '@mantine/core';

function VideoComponent() {
  return (
    <Paper p="lg" shadow="sm" style={{ borderRadius: '8px' }}>
      <TypographyStylesProvider
        styles={{
          h5: {
            fontWeight: 800,
            fontSize: '1.25rem',
            marginBottom: '16px',
            textAlign: 'center',
            fontFamily: 'Greycliff CF, sans-serif',
          },
        }}
      >
        <Title order={5} mb="md">
          Your Live Farm View
        </Title>
      </TypographyStylesProvider>
      <video style={{ width: '100%', height: '100%', objectFit: 'cover' }} loop autoPlay muted>
        <source src="/videos/farm.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </Paper>
  );
}

export default VideoComponent;
