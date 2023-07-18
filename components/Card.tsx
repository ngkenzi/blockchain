import { createStyles, SimpleGrid, Card, Image, Text, Container, AspectRatio } from '@mantine/core';

const mockdata = [
  {
    title: 'Kajang',
    image:
    '/images/intro.png',
    date: 'Hydroponic Set',
  },
  {
    title: 'Kuala Pilah',
    image:
    '/images/kualapilah.jpg',
    date: 'Hydroponic Set',
  },
  {
    title: 'SMK Kajang Utama',
    image:
    '/images/smk.jpg',
    date: 'Hydroponic Set',
  },
  {
    title: 'Seremban',
    image:
    '/images/seremban.jpg',
    date: 'Hydroponic Set',
  },
  {
    title: 'Bandar Baru Bangi',
    image:
    '/images/bangi.jpg',
    date: 'Hydroponic Set',
  },
  {
    title: 'Klang',
    image:
    '/images/klang.png',
    date: 'Hydroponic Set',
  },
];

const useStyles = createStyles((theme) => ({
  card: {
    transition: 'transform 150ms ease, box-shadow 150ms ease',

    '&:hover': {
      transform: 'scale(1.01)',
      boxShadow: theme.shadows.md,
    },
  },

  title: {
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
    fontWeight: 600,
  },
}));

export function ArticlesCardsGrid() {
  const { classes } = useStyles();

  const cards = mockdata.map((article) => (
    <Card key={article.title} p="md" radius="md" component="a" href="#" className={classes.card}>
      <AspectRatio ratio={1920 / 1080}>
        <Image src={article.image} alt={article.title} />
      </AspectRatio>
      <Text color="dimmed" size="xs" transform="uppercase" weight={700} mt="md">
        {article.date}
      </Text>
      <Text className={classes.title} mt={5}>
        {article.title}
      </Text>
    </Card>
  ));

  return (
    <Container py="xl">
      <SimpleGrid cols={2} breakpoints={[{ maxWidth: 'sm', cols: 1 }]}>
        {cards}
      </SimpleGrid>
    </Container>
  );
}