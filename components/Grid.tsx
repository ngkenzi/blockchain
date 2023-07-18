import { Container, Grid, Text, Paper } from '@mantine/core';
import Image from 'next/image';

interface LeadGridProps {
  title: string;
  description: string;
  imageSrc: string;
}

export const LeadGrid: React.FC<LeadGridProps> = ({ title, description, imageSrc }) => {
  return (
    <Container size={560}>
      <Grid>
        <Grid.Col span={6}>
          <Text>{title}</Text>
          <Text>{description}</Text>
        </Grid.Col>
        <Grid.Col span={6}>
          <Paper style={{ height: '100%', width: '100%', position: 'relative' }}>
            <Image src={imageSrc} alt={title} width="100" height="100"/>
          </Paper>
        </Grid.Col>
      </Grid>
    </Container>
  );
}
