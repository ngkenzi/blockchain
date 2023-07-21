import { Tabs } from '@mantine/core';
import { Grid } from '@mantine/core';
import { CourseCard } from './Card';
import { chunkArray } from '../utils';

type Course = {
    imageUrl: string;
    altText: string;
    courseTitle: string;
    onSale: boolean;
    description: string;
    buttonLabel: string;
  };

const CourseTabs: React.FC<{ courses: Course[] }> = ({ courses }) => {
  const onSaleCourses = courses.filter(course => course.onSale);
  const notOnSaleCourses = courses.filter(course => !course.onSale);
  
  return (
    <Tabs variant="pills" radius="md" defaultValue="allCourses">
      <Tabs.List>
        <Tabs.Tab value="allCourses">All Courses</Tabs.Tab>
        <Tabs.Tab value="onSale">On Sale</Tabs.Tab>
        <Tabs.Tab value="notOnSale">Not On Sale</Tabs.Tab>
      </Tabs.List>

      <Tabs.Panel value="allCourses" pt="xs">
        {chunkArray(courses, 3).map(renderCourses)}
      </Tabs.Panel>

      <Tabs.Panel value="onSale" pt="xs">
        {chunkArray(onSaleCourses, 3).map(renderCourses)}
      </Tabs.Panel>

      <Tabs.Panel value="notOnSale" pt="xs">
        {chunkArray(notOnSaleCourses, 3).map(renderCourses)}
      </Tabs.Panel>
    </Tabs>
  );
  
  function renderCourses(chunk: Course[], index: number) {
    return (
      <Grid key={index} gutter="md" style={{ marginBottom: '20px' }}>
        {chunk.map((course, i) => (
          <Grid.Col key={i} span={4}>
            <CourseCard {...course} />
          </Grid.Col>
        ))}
      </Grid>
    );
  }
};

export default CourseTabs;
