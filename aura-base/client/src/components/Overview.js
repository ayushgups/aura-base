import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Link, useParams, useEffect, useNavigate } from 'react-router-dom';
import supabase from "../helper/supabaseClient";
import AuraLeaderboard from './AuraLeaderboard';
import StatsCards from './StatsCards';
import RecentActivity from './RecentActivity';
import ReviewNotifications from './ReviewNotifications';

function Overview() {
  const navigate = useNavigate();

  const signOut = async () => {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      navigate("/");
  }

  return (
    <Container fluid className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Overview</h1>
        <div className="team-selector">
          The Kava Kangaroos
        </div>
        <button onClick={signOut}>Log Out</button>
      </div>
      
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
    </Container>
  );
}

export default Overview; 