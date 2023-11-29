import React, { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
import axios from "axios";
Chart.register(...registerables);

const ChartComponent = () => {
  const [studentCount, setStudentCount] = useState(0);
  const [universityCount, setUniversityCount] = useState(0);
  const [companyCount, setCompanyCount] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [studentsRes, universitiesRes, companiesRes] = await Promise.all([
          axios.get("/api/getStudentsInfo"),
          axios.get("/api/universities"),
          axios.get("/api/company"),
        ]);

        setStudentCount(studentsRes.data.length);
        setUniversityCount(universitiesRes.data.length);
        setCompanyCount(companiesRes.data.length);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    

    fetchData();
  }, []);

  const data = {
    labels: [
      "Registered Students",
      "Registered Universities",
      "Registered Companies",
    ],
    datasets: [
      {
        label: "Count",
        data: [studentCount, universityCount, companyCount],
        backgroundColor: [
          "rgba(255, 99, 132, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(255, 206, 86, 0.2)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    plugins: {
      title: {
        display: true,
        text: "Registered Users",
        font: {
          size: 18,
        },
        padding: {
          top: 10,
          bottom: 30,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return <Bar data={data} options={options} />;
};

export default ChartComponent;
