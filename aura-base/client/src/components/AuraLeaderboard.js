import React, { useEffect } from 'react';
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
import './AuraLeaderboard.css';

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
        borderRadius: 8,
        barThickness: 100,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 1000,
      easing: 'easeInOutQuart'
    },
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: 'Aura Leaderboard',
        align: 'start',
        font: {
          size: 20,
          weight: 'bold'
        },
        padding: {
          bottom: 30
        }
      },
      tooltip: {
        backgroundColor: 'white',
        titleColor: '#333',
        bodyColor: '#666',
        titleFont: {
          size: 16,
          weight: 'bold'
        },
        bodyFont: {
          size: 14
        },
        padding: 12,
        displayColors: false,
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.1)',
        callbacks: {
          title: (items) => items[0].label,
          label: (item) => `Aura: ${item.raw}`
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          display: false
        },
        border: {
          display: false
        },
        ticks: {
          padding: 8
        }
      },
      x: {
        grid: {
          display: false
        },
        border: {
          display: false
        }
      }
    },
    layout: {
      padding: {
        left: 10,
        right: 10
      }
    }
  };

  return (
    <Card className="mb-4 aura-leaderboard">
      <Card.Body>
        <Bar data={data} options={options} />
      </Card.Body>
    </Card>
  );
};

export default AuraLeaderboard; 