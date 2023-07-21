import { Card, Image, Text, Badge, Button, Group } from '@mantine/core';

interface CourseCardProps {
  imageUrl: string;
  altText: string;
  courseTitle: string;
  onSale: boolean;
  description: string;
  buttonLabel: string;
}

export const CourseCard: React.FC<CourseCardProps> = ({ imageUrl, altText, courseTitle, onSale, description, buttonLabel }) => {
  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Card.Section>
        <Image
          src={imageUrl}
          height={160}
          alt={altText}
        />
      </Card.Section>

      <Group position="apart" mt="md" mb="xs">
        <Text weight={500}>{courseTitle}</Text>
        {onSale && <Badge color="pink" variant="light">Tech</Badge>}
      </Group>

      <Text size="sm" color="dimmed">{description}</Text>

      <Button variant="light" color="blue" fullWidth mt="md" radius="md">{buttonLabel}</Button>
    </Card>
  );
}
