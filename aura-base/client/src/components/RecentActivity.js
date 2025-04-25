import React from 'react';
import { Card, ListGroup } from 'react-bootstrap';
import { FaArrowUp, FaArrowDown } from 'react-icons/fa';
import './RecentActivity.css';

const ActivityItem = ({ user, action, change, description }) => (
  <ListGroup.Item className="activity-item">
    <div className="d-flex">
      <div className="activity-left d-flex">
        <img src={user.avatar} alt={user.name} className="activity-avatar" />
        <div className="ms-3">
          <div className="user-info">
            <strong>{user.name}</strong>
            <div className={`aura-change ${change > 0 ? 'gained' : 'lost'}`}>
              {change > 0 ? 'Gained' : 'Lost'} {Math.abs(change)} Aura
            </div>
          </div>
        </div>
      </div>
      
      <div className="arrow-container">
        {change > 0 ? (
          <FaArrowUp className="arrow up" />
        ) : (
          <FaArrowDown className="arrow down" />
        )}
      </div>
      
      <div className="activity-description">
        {description}
      </div>
    </div>
  </ListGroup.Item>
);

const RecentActivity = () => {
  const activities = [
    {
      user: { name: 'Ayush Gupta', avatar: '/avatar-placeholder.png' },
      action: 'gained',
      change: 100,
      description: 'The description of what Ayush did to gain aura.'
    },
    {
      user: { name: 'Tarun Shah', avatar: '/avatar-placeholder.png' },
      action: 'lost',
      change: -150,
      description: 'The description of what Tarun did to lose aura.'
    },
    {
      user: { name: 'Krish Arora', avatar: '/avatar-placeholder.png' },
      action: 'gained',
      change: 100,
      description: 'The description of what Krish did to gain aura.'
    }
  ];

  return (
    <Card className="mb-4 recent-activity">
      <Card.Header className="bg-white">
        <h5 className="mb-0 fw-bold">Recent Activity</h5>
      </Card.Header>
      <ListGroup variant="flush">
        {activities.map((activity, index) => (
          <ActivityItem key={index} {...activity} />
        ))}
      </ListGroup>
    </Card>
  );
};

export default RecentActivity; 