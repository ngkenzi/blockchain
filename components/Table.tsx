import { useState, ChangeEvent } from 'react';
import { Table, Text, Switch, Paper, Title } from '@mantine/core';

interface DataItem {
  time: string;
  water: string;
  nutrients: string;
  light: string;
  suggestion: string;
}

interface DataTableProps {
  data: DataItem[];
}

export function DataTable({ data }: DataTableProps) {
  const [tableData, setTableData] = useState<DataItem[]>(data);

  const handleSwitchChange = (index: number, field: keyof DataItem, value: boolean) => {
    const updatedData = [...tableData];
    updatedData[index][field] = value ? 'ON' : 'OFF';
    setTableData(updatedData);
  };

  return (
    <Paper p="lg" shadow="sm" style={{ borderRadius: '8px' }}>
      <Title order={5} mb="md">
        Automation Recipe Control
      </Title>
      <Table>
        <thead>
          <tr>
            <th>Time</th>
            <th>Water</th>
            <th>Nutrients</th>
            <th>Light</th>
            <th>Suggestion</th>
          </tr>
        </thead>
        <tbody>
          {tableData.map((item, index) => (
            <tr key={index}>
              <td>{item.time}</td>
              <td>
                <Switch
                  checked={item.water === 'ON'}
                  onChange={(event: ChangeEvent<HTMLInputElement>) =>
                    handleSwitchChange(index, 'water', event.target.checked)
                  }
                />
              </td>
              <td>
                <Switch
                  checked={item.nutrients === 'ON'}
                  onChange={(event: ChangeEvent<HTMLInputElement>) =>
                    handleSwitchChange(index, 'nutrients', event.target.checked)
                  }
                />
              </td>
              <td>
                <Switch
                  checked={item.light === 'ON'}
                  onChange={(event: ChangeEvent<HTMLInputElement>) =>
                    handleSwitchChange(index, 'light', event.target.checked)
                  }
                />
              </td>
              <td>{item.suggestion}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Paper>
  );
}
