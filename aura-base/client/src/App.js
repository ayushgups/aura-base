import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Container, Row, Col } from 'react-bootstrap';
import Sidebar from './components/Sidebar';
import AuraLeaderboard from './components/AuraLeaderboard';
import StatsCards from './components/StatsCards';
import RecentActivity from './components/RecentActivity';
import ReviewNotifications from './components/ReviewNotifications';
import History from './components/History';
import Submit from './components/Submit';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function HomePage() {
  return (
    <Container fluid className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Overview</h1>
        <div className="team-selector">
          The Kava Kangaroos
        </div>
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

function App() {
  return (
    <Router>
      <div className="app">
        <Sidebar />
        <div className="main-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/submit" element={<Submit />} />
            <Route path="/history" element={
              <Container fluid className="py-4">
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h1>History</h1>
                  <div className="team-selector">
                    The Kava Kangaroos
                  </div>
                </div>
                <History />
              </Container>
            } />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;