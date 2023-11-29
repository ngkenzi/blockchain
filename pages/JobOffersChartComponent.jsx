import React, { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
import axios from "axios";
Chart.register(...registerables);

const JobOffersChartComponent = () => {
  const [jobOfferCount, setJobOfferCount] = useState(0);
  const [statusCounts, setStatusCounts] = useState({
    accepted: 0,
    pending: 0,
    rejected: 0,
  });

  useEffect(() => {
    const fetchJobOffers = async () => {
      try {
        const response = await axios.get("/api/notifications");
        const notifications = response.data;

        setJobOfferCount(notifications.length); // Set total job offers count

        // Counting the status occurrences
        const counts = { accepted: 0, pending: 0, rejected: 0 };
        notifications.forEach((notification) => {
          if (notification.status === "Accepted") counts.accepted += 1;
          else if (notification.status === "pending") counts.pending += 1;
          else if (notification.status === "Rejected") counts.rejected += 1;
        });

        setStatusCounts(counts);
      } catch (error) {
        console.error("Error fetching job offers:", error);
      }
    };

    fetchJobOffers();
  }, []);

  const data = {
    labels: ["Total Job Offers", "Accepted", "Pending", "Rejected"],
    datasets: [
      {
        label: "Job Offers",
        data: [
          jobOfferCount,
          statusCounts.accepted,
          statusCounts.pending,
          statusCounts.rejected,
        ],
        backgroundColor: [
          "rgba(54, 162, 235, 0.2)",
          "rgba(75, 192, 192, 0.2)",
          "rgba(255, 206, 86, 0.2)",
          "rgba(255, 99, 132, 0.2)",
        ],
        borderColor: [
          "rgba(54, 162, 235, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(255, 99, 132, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
    plugins: {
      title: {
        display: true,
        text: "Job Offers Overview",
        font: {
          size: 18,
        },
        padding: {
          top: 10,
          bottom: 30,
        },
      },
    },
  };

  return <Bar data={data} options={options} />;
};

export default JobOffersChartComponent;
