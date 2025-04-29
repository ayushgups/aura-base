import React, { useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Link, useParams, useNavigate } from 'react-router-dom';
import supabase from "../helper/supabaseClient";
import AuraLeaderboard from './AuraLeaderboard';
import StatsCards from './StatsCards';
import RecentActivity from './RecentActivity';
import ReviewNotifications from './ReviewNotifications';
import Avatar from './Avatar';

function Overview() {
  const navigate = useNavigate();
  const { userid } = useParams();

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
    const fetchGroupName = async () => {
      try {
        const response = await fetch(`http://localhost:5001/api/get-default-group?userid=${userid}`);
        const data = await response.json();
        setGroupName(data.group || null);
      } catch (error) {
        console.error('Error fetching group:', error);
        setGroupName(null);
      } finally {
        setLoading(false);
      }
    };

    if (userid) fetchGroupName();
  }, [userid]);

  if (loading) {
    return null; // Optional: return a spinner here
  }

  return (
    <Container fluid className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Overview</h1>

        <div className="d-flex align-items-center" style={{ gap: '1rem', position: 'relative' }}>
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

          <div style={{ position: 'relative', cursor: 'pointer' }} onClick={handleAvatarClick}>
            {userName && <Avatar name={userName} size={45} />}
            {showDropdown && (
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
              <RecentActivity groupName={groupName} />
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

export default Overview;
