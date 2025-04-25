import React from 'react';
import { Nav } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import { FaHome, FaUpload, FaHistory } from 'react-icons/fa';
import './Sidebar.css';

const Sidebar = () => {
  const location = useLocation();

  return (
    <div className="sidebar bg-dark text-white">
      <div className="sidebar-brand mb-4 p-3">
        <img src="/logo.png" alt="AuraBase" className="sidebar-logo" />
        <span className="ms-2 h4">AuraBase</span>
      </div>
      <Nav className="flex-column">
        <Nav.Link 
          as={Link} 
          to="/" 
          className={`text-white ${location.pathname === '/' ? 'active' : ''}`}
        >
          <FaHome className="me-2" /> Home
        </Nav.Link>
        <Nav.Link 
          as={Link} 
          to="/submit" 
          className={`text-white ${location.pathname === '/submit' ? 'active' : ''}`}
        >
          <FaUpload className="me-2" /> Submit
        </Nav.Link>
        <Nav.Link 
          as={Link} 
          to="/history" 
          className={`text-white ${location.pathname === '/history' ? 'active' : ''}`}
        >
          <FaHistory className="me-2" /> History
        </Nav.Link>
      </Nav>
    </div>
  );
};

export default Sidebar; 