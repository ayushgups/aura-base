import React from 'react';
import { Card, ListGroup } from 'react-bootstrap';
import { FaArrowUp, FaArrowDown, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import './History.css';
import axios from 'axios';
import { useEffect, useState } from 'react';


const HistoryItem = ({ user, auraChange, description }) => (
  <ListGroup.Item className="history-item">
    <div className="d-flex align-items-start">
      <img src={user.avatar} alt={user.name} className="history-avatar" />
      <div className="history-content ms-3">
        <div className="d-flex justify-content-between align-items-center mb-1">
          <div className="history-user">{user.name}</div>
          <div className="history-aura">
            {auraChange > 0 ? (
              <>
                <FaArrowUp className="text-success" />
                <span className="text-success ms-1">Gained {auraChange} Aura</span>
              </>
            ) : (
              <>
                <FaArrowDown className="text-danger" />
                <span className="text-danger ms-1">Lost {Math.abs(auraChange)} Aura</span>
              </>
            )}
          </div>
        </div>
        <div className="history-description text-muted">{description}</div>
      </div>
    </div>
  </ListGroup.Item>
);

const History = () => {
  const [historyData, setHistoryData] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get('http://localhost:5001/api/get-events');
        const formatted = response.data.map(event => ({
          user: {
            name: event.name,
            avatar: '/avatar-placeholder.png'  // optionally fetch real avatars later
          },
          auraChange: event.aura_points,
          description: event.description
        }));
        setHistoryData(formatted);
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };

    fetchEvents();
  }, []);
}

export default History;