import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Card } from 'react-bootstrap';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const AuraLeaderboard = () => {
  const data = {
    labels: ['Krish', 'Sydney', 'Luvinia', 'Tarun', 'Ayush'],
    datasets: [
      {
        data: [420, 380, 340, 300, 260],
        backgroundColor: [
          'rgba(135, 206, 235, 0.8)',
          'rgba(255, 178, 102, 0.8)',
          'rgba(255, 153, 153, 0.8)',
          'rgba(255, 255, 153, 0.8)',
          'rgba(216, 191, 216, 0.8)',
        ],
        borderColor: [
          'rgb(135, 206, 235)',
          'rgb(255, 178, 102)',
          'rgb(255, 153, 153)',
          'rgb(255, 255, 153)',
          'rgb(216, 191, 216)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: 'Aura Leaderboard',
        font: {
          size: 20
        }
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <Card className="mb-4">
      <Card.Body>
        <Bar data={data} options={options} />
      </Card.Body>
    </Card>
  );
};

export default AuraLeaderboard; 