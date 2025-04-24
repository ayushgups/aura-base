import React from 'react';
import { Card } from 'react-bootstrap';
import { FaCrown, FaPoop, FaFire, FaUser } from 'react-icons/fa';
import './StatsCards.css';

const StatsCard = ({ icon, value, label, iconClass }) => (
  <div className="stat-item">
    <div className={`stat-circle ${iconClass}`}>
      <div className="stat-value">{value}</div>
      <div className="stat-icon">{icon}</div>
    </div>
    <div className="stat-label-group">
      <div className="stat-label-title">{label.split(':')[0]}:</div>
      <div className="stat-label-name">{label.split(':')[1]}</div>
    </div>
  </div>
);

const StatsCards = () => {
  return (
    <Card className="stats-container">
      <Card.Body className="p-0">
        <div className="stats-grid">
          <StatsCard
            icon={<FaCrown />}
            value="420"
            label="Current Winner:Krish Arora"
            iconClass="crown"
          />
          <StatsCard
            icon={<FaPoop />}
            value="30"
            label="Current Shitter:Sydney Dinh"
            iconClass="poop"
          />
          <StatsCard
            icon={<FaFire />}
            value="+40"
            label="Biggest Gainer:Ayush Gupta"
            iconClass="fire"
          />
          <StatsCard
            icon={<FaUser />}
            value="350"
            label="Your Current:Aura Level"
            iconClass="user"
          />
        </div>
      </Card.Body>
    </Card>
  );
};

export default StatsCards; 