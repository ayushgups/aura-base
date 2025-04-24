import React from 'react';
import { Card, Button } from 'react-bootstrap';
import { FaCheck, FaTimes } from 'react-icons/fa';
import './ReviewNotifications.css';

const ReviewNotifications = () => {
  const notification = {
    auraChange: -100,
    description: 'Tarun was at Cafe 3 and he squirted some pancake batter on himself'
  };

  return (
    <Card className="review-notifications">
      <Card.Header>
        <div className="d-flex justify-content-between align-items-center">
          <h5 className="mb-0">Review Notifications</h5>
          <small className="text-muted">Approve or Deny this request</small>
        </div>
      </Card.Header>
      <Card.Body>
        <div className="notification-content">
          <div className="aura-change text-danger mb-2">
            {notification.auraChange} Aura
          </div>
          <p className="notification-text mb-3">
            {notification.description}
          </p>
          <div className="d-flex gap-2">
            <Button variant="success" className="flex-grow-1">
              <FaCheck className="me-2" />
              Approve
            </Button>
            <Button variant="danger" className="flex-grow-1">
              <FaTimes className="me-2" />
              Deny
            </Button>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};

export default ReviewNotifications; 