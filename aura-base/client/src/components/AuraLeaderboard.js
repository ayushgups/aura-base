import React, { useEffect, useState } from 'react';
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

const AuraLeaderboard = ({ groupName }) => {
  const [labels, setLabels] = useState([]);
  const [scores, setScores] = useState([]);

  useEffect(() => {
    const fetchTopUsers = async () => {
      try {
        const response = await fetch(`http://localhost:5001/api/dashboard-results?group_id=${encodeURIComponent(groupName)}`);
        const data = await response.json();

        const names = data.map(user => user.name);
        const auraPoints = data.map(user => user.total_aura_points);

        // Pad if less than 5 users
        while (names.length < 5) {
          names.push('');
          auraPoints.push(0);
        }

        setLabels(names);
        setScores(auraPoints);

      } catch (error) {
        console.error('Error fetching top users:', error);
      }
    };

    fetchTopUsers();
  }, [groupName]);

  const data = {
    labels,
    datasets: [
      {
        data: scores,
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
      legend: { display: false },
      title: {
        display: true,
        text: 'Aura Leaderboard',
        align: 'start',
        font: { size: 20, weight: 'bold' },
        padding: { bottom: 30 }
      },
      tooltip: {
        backgroundColor: 'white',
        titleColor: '#333',
        bodyColor: '#666',
        titleFont: { size: 16, weight: 'bold' },
        bodyFont: { size: 14 },
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
        grid: { display: false },
        border: { display: false },
        ticks: { padding: 8 }
      },
      x: {
        grid: { display: false },
        border: { display: false }
      }
    },
    layout: {
      padding: { left: 10, right: 10 }
    }
  };

<<<<<<< HEAD
    return (
    <Card className="mb-4 aura-leaderboard">
      <Card.Body style={{ height: '400px' }}>  {/* ✅ Fixed height */}
        <Bar data={data} options={options} />
      </Card.Body>
    </Card>
  );
=======
    return (
    <Card className="mb-4 aura-leaderboard">
      <Card.Body style={{ height: '400px' }}>  {/* ✅ Fixed height */}
        <Bar data={data} options={options} />
      </Card.Body>
    </Card>
  );
>>>>>>> c210110ff1aa28f4f44ecaf3d7e9c1550aeb5ee2
};

export default AuraLeaderboard;