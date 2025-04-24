import React from 'react';
import { Card, ListGroup } from 'react-bootstrap';
import { FaArrowUp, FaArrowDown } from 'react-icons/fa';
import './RecentActivity.css';

const ActivityItem = ({ user, action, change, description }) => (
  <ListGroup.Item className="activity-item">
    <div className="d-flex align-items-center">
      <img src={user.avatar} alt={user.name} className="activity-avatar" />
      <div className="ms-3 flex-grow-1">
        <div className="d-flex justify-content-between align-items-center">
          <strong>{user.name}</strong>
          <span className={change > 0 ? 'text-success' : 'text-danger'}>
            {change > 0 ? <FaArrowUp /> : <FaArrowDown />}
            {Math.abs(change)} Aura
          </span>
        </div>
        <div className="text-muted">{description}</div>
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
    <Card className="mb-4">
      <Card.Header>
        <h5 className="mb-0">Recent Activity</h5>
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