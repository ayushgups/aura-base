<<<<<<< HEAD
import React, { useEffect, useState } from 'react';
=======
import React, { useState, useEffect } from 'react';
>>>>>>> c210110ff1aa28f4f44ecaf3d7e9c1550aeb5ee2
import { Container, Row, Col } from 'react-bootstrap';
import { Link, useParams, useNavigate } from 'react-router-dom';
import supabase from "../helper/supabaseClient";
import AuraLeaderboard from './AuraLeaderboard';
import StatsCards from './StatsCards';
import RecentActivity from './RecentActivity';
import ReviewNotifications from './ReviewNotifications';
<<<<<<< HEAD
import Avatar from './Avatar.js';
=======
import Avatar from './Avatar';
>>>>>>> c210110ff1aa28f4f44ecaf3d7e9c1550aeb5ee2

function Overview() {
  const navigate = useNavigate();
  const { userid } = useParams();

<<<<<<< HEAD
  const [showMenu, setShowMenu] = React.useState(false);
  const [groupName, setGroupName] = useState(null);
  const [loading, setLoading] = useState(true);

  const signOut = async () => {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      navigate("/");
  };

  const handleAvatarClick = () => {
    setShowMenu((prev) => !prev);
  };

  useEffect(() => {
=======
  const [userName, setUserName] = useState('');
  const [groupName, setGroupName] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDropdown, setDropdown] = useState(false);

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    navigate("/");
  };

  const handleAvatarClick = () => {
    setDropdown((prev) => !prev);
  };

  useEffect(() => {
    const fetchUserName = async () => {
      const { data, error } = await supabase
        .from('users')
        .select('name')
        .eq('user_id', userid)
        .single();

      if (error) {
        console.error('Error fetching user name:', error);
      } else {
        setUserName(data.name);
      }
    };

    if (userid) fetchUserName();
  }, [userid]);

  useEffect(() => {
>>>>>>> c210110ff1aa28f4f44ecaf3d7e9c1550aeb5ee2
    const fetchGroupName = async () => {
      try {
        const response = await fetch(`http://localhost:5001/api/get-default-group?userid=${userid}`);
        const data = await response.json();
<<<<<<< HEAD
        if (data.group) {
          setGroupName(data.group);
        } else {
          setGroupName(null);
        }
=======
        setGroupName(data.group || null);
>>>>>>> c210110ff1aa28f4f44ecaf3d7e9c1550aeb5ee2
      } catch (error) {
        console.error('Error fetching group:', error);
        setGroupName(null);
      } finally {
        setLoading(false);
      }
    };
<<<<<<< HEAD
    if (userid) {
      fetchGroupName();
    }
  }, [userid]);

  if (loading) {
    return null; // or you could add a simple "Loading..." spinner if you want
=======

    if (userid) fetchGroupName();
  }, [userid]);

  if (loading) {
    return null; // Optional: return a spinner here
>>>>>>> c210110ff1aa28f4f44ecaf3d7e9c1550aeb5ee2
  }

  return (
    <Container fluid className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Overview</h1>

        <div className="d-flex align-items-center" style={{ gap: '1rem', position: 'relative' }}>
<<<<<<< HEAD
          {/* Team Selector */}
=======
>>>>>>> c210110ff1aa28f4f44ecaf3d7e9c1550aeb5ee2
          {groupName && (
            <div className="team-selector" style={{
              backgroundColor: '#f1f1f1',
              borderRadius: '9999px',
              padding: '8px 16px',
              fontWeight: 'bold',
            }}>
              {groupName}
            </div>
          )}

<<<<<<< HEAD
          {/* Avatar */}
          <div style={{ position: 'relative', cursor: 'pointer' }} onClick={handleAvatarClick}>
            <Avatar name="Ayush Gupta" size={45} />
            
            {showMenu && (
=======
          <div style={{ position: 'relative', cursor: 'pointer' }} onClick={handleAvatarClick}>
            {userName && <Avatar name={userName} size={45} />}
            {showDropdown && (
>>>>>>> c210110ff1aa28f4f44ecaf3d7e9c1550aeb5ee2
              <div style={{
                position: 'absolute',
                right: 0,
                marginTop: '10px',
                backgroundColor: 'white',
                border: '1px solid #ccc',
                borderRadius: '8px',
                boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                width: '120px',
                zIndex: 100,
              }}>
                <button onClick={signOut} style={{
                  width: '100%',
                  padding: '8px',
                  border: 'none',
                  backgroundColor: 'transparent',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                }}>
                  Log Out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {groupName ? (
        <>
          {/* Top row with Leaderboard and Stats */}
          <Row className="g-4 mb-4">
            <Col lg={8}>
              <AuraLeaderboard groupName={groupName} />
            </Col>
            <Col lg={4}>
              <StatsCards />
            </Col>
          </Row>

          {/* Bottom row with Activity and Notifications */}
          <Row className="g-4">
            <Col lg={8}>
<<<<<<< HEAD
              <RecentActivity />
=======
              <RecentActivity groupName={groupName} />
>>>>>>> c210110ff1aa28f4f44ecaf3d7e9c1550aeb5ee2
            </Col>
            <Col lg={4}>
              <ReviewNotifications />
            </Col>
          </Row>
        </>
      ) : (
        <div className="text-center" style={{ marginTop: '50px', fontSize: '1.2rem' }}>
          You haven't joined any groups yet! Join or create one{' '}
          <Link to={`/groups/${userid}`} style={{ textDecoration: 'underline' }}>here</Link>.
        </div>
      )}
    </Container>
  );
}

<<<<<<< HEAD
export default Overview;
=======
export default Overview;
>>>>>>> c210110ff1aa28f4f44ecaf3d7e9c1550aeb5ee2
