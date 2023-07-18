import React from 'react';
import { Paper, Table, Title } from '@mantine/core';

export interface DataItem2 {
  farmname: string;
  location: string;
  croptype: string;
  farmsize: string;
}

interface DataTableProps {
  data: DataItem2[];
}

export const DataTable2: React.FC<DataTableProps> = ({ data }) => {
  return (
    <Paper p="lg" shadow="sm" style={{ borderRadius: '8px' }}>
      <Title order={5} mb="md">
        Farm Information
      </Title>
      <Table>
        <thead>
          <tr>
            <th>Farm Name</th>
            <th>Location</th>
            <th>Crop Type</th>
            <th>Farm Size</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index}>
              <td>{item.farmname}</td>
              <td>{item.location}</td>
              <td>{item.croptype}</td>
              <td>{item.farmsize}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Paper>
  );
};
