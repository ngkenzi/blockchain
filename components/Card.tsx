import { Card, Image, Text, Badge, Button, Group } from '@mantine/core';
import Link from 'next/link';

interface CourseCardProps {
  imageUrl: string;
  altText: string;
  courseTitle: string;
  onSale: boolean;
  description: string;
  buttonLabel: string;
  link: string;
}

export const CourseCard: React.FC<CourseCardProps> = ({ imageUrl, altText, courseTitle, onSale, description, buttonLabel, link }) => {
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

      <Link href={link}>
          <Button variant="light" color="blue" fullWidth mt="md" radius="md" >
            {buttonLabel}
          </Button>
      </Link>
    </Card>
  );
}
