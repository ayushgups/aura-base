import React from 'react';
import { Card, ListGroup } from 'react-bootstrap';
import { FaArrowUp, FaArrowDown, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import './History.css';

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
  const historyData = [
    {
      user: {
        name: 'Ayush Gupta',
        avatar: '/avatar-placeholder.png'
      },
      auraChange: 100,
      description: 'The description of what Ayush did to gain aura. The description of what Ayush did to gain aura. The description of what Ayush did to gain aura. The description of what.'
    },
    {
      user: {
        name: 'Tarun Shah',
        avatar: '/avatar-placeholder.png'
      },
      auraChange: -150,
      description: 'The description of what Tarun did to lose aura. The description of what Tarun did to gain aura. The description of what Tarun did to gain aura. The description of what.'
    },
    {
      user: {
        name: 'Tarun Shah',
        avatar: '/avatar-placeholder.png'
      },
      auraChange: -150,
      description: 'The description of what Tarun did to lose aura. The description of what Tarun did to gain aura. The description of what Tarun did to gain aura. The description of what.'
    },
    {
      user: {
        name: 'Ayush Gupta',
        avatar: '/avatar-placeholder.png'
      },
      auraChange: 100,
      description: 'The description of what Ayush did to gain aura. The description of what Ayush did to gain aura. The description of what Ayush did to gain aura. The description of what.'
    },
    {
      user: {
        name: 'Tarun Shah',
        avatar: '/avatar-placeholder.png'
      },
      auraChange: -150,
      description: 'The description of what Tarun did to lose aura. The description of what Tarun did to gain aura. The description of what Tarun did to gain aura. The description of what.'
    }
  ];

  return (
    <Card className="history-card">
      <Card.Header className="d-flex justify-content-between align-items-center">
        <h5 className="mb-0">Aura History</h5>
        <div className="history-nav">
          <button className="btn btn-link text-muted">
            <FaChevronLeft />
          </button>
          <button className="btn btn-link text-muted">
            <FaChevronRight />
          </button>
        </div>
      </Card.Header>
      <ListGroup variant="flush">
        {historyData.map((item, index) => (
          <HistoryItem key={index} {...item} />
        ))}
      </ListGroup>
    </Card>
  );
};

export default History;