import React from 'react';
import { Row, Col } from 'react-bootstrap';
import AuraLeaderboard from './AuraLeaderboard';
import StatsCards from './StatsCards';
import RecentActivity from './RecentActivity';
import ReviewNotifications from './ReviewNotifications';

const Overview = () => {
  return (
    <>
      {/* Top row with Leaderboard and Stats */}
      <Row className="g-4 mb-4">
        <Col lg={8}>
          <AuraLeaderboard />
        </Col>
        <Col lg={4}>
          <StatsCards />
        </Col>
      </Row>

      {/* Bottom row with Activity and Notifications */}
      <Row className="g-4">
        <Col lg={8}>
          <RecentActivity />
        </Col>
        <Col lg={4}>
          <ReviewNotifications />
        </Col>
      </Row>
    </>
  );
};

export default Overview; 