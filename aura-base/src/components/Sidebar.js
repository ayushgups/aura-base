import React from 'react';
import { Nav } from 'react-bootstrap';
import { FaHome, FaUpload, FaHistory } from 'react-icons/fa';
import './Sidebar.css';

const Sidebar = () => {
  return (
    <div className="sidebar bg-dark text-white">
      <div className="sidebar-brand mb-4 p-3">
        <img src="/logo.png" alt="AuraBase" className="sidebar-logo" />
        <span className="ms-2 h4">AuraBase</span>
      </div>
      <Nav className="flex-column">
        <Nav.Link className="text-white">
          <FaHome className="me-2" /> Home
        </Nav.Link>
        <Nav.Link className="text-white">
          <FaUpload className="me-2" /> Submit
        </Nav.Link>
        <Nav.Link className="text-white">
          <FaHistory className="me-2" /> History
        </Nav.Link>
      </Nav>
    </div>
  );
};

export default Sidebar; 