import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Container} from 'react-bootstrap';
import History from './components/History';
import Submit from './components/Submit';
import Register from "./components/Register";
import Login from "./components/Login"
import Home from './components/Home';
import Groups from './components/Groups';
import Overview from './components/Overview';
import Wrapper from './components/Wrapper';
import DashboardLayout from './components/DashboardLayout';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard/:userid" element={<DashboardLayout><Wrapper><Overview /></Wrapper></DashboardLayout>} />
        <Route path="/submit/:userid" element={<DashboardLayout><Wrapper><Submit /></Wrapper></DashboardLayout>} />
        <Route path="/groups/:userid" element={<DashboardLayout><Wrapper><Groups /></Wrapper></DashboardLayout>} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/history/:userid" element={
          <DashboardLayout>
            <Wrapper>
              <Container fluid className="py-4">
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h1>History</h1>
                  <div className="team-selector">
                    The Kava Kangaroos
                  </div>
                </div>
                <History />
              </Container>
            </Wrapper>
          </DashboardLayout>
        } />
      </Routes>
    </Router>
  );
}

export default App;