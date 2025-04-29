import React, { useEffect, useState } from 'react';
import { Card, ListGroup, Dropdown } from 'react-bootstrap';
import { FaArrowUp, FaArrowDown } from 'react-icons/fa';
import { useParams, Link } from 'react-router-dom';
import Avatar from './Avatar';
import supabase from '../helper/supabaseClient';
import './History.css';

const HistoryItem = ({ user, auraChange, description }) => (
  <ListGroup.Item className="history-item">
    <div className="d-flex align-items-start">
      <Avatar name={user.name} size={45} />
      <div className="history-content ms-3">
        <div className="d-flex justify-content-between align-items-center mb-1">
          <div className="history-user">{user.name}</div>
          <div className="history-aura">
            {auraChange > 0 ? (
              <>
                <FaArrowUp className="text-success" />
                <span className="text-success ms-1">Gained {auraChange} Aura</span>
              </>
            ) : (
              <>
                <FaArrowDown className="text-danger" />
                <span className="text-danger ms-1">Lost {Math.abs(auraChange)} Aura</span>
              </>
            )}
          </div>
        </div>
        <div className="history-description text-muted">{description}</div>
      </div>
    </div>
  </ListGroup.Item>
);

const History = () => {
  const { userid } = useParams();
  const [groupName, setGroupName] = useState(null); // selected group_id
  const [groupOptions, setGroupOptions] = useState([]); // { id, name }
  const [historyData, setHistoryData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserGroups = async () => {
      const { data, error } = await supabase
        .from('users')
        .select('group_name')
        .eq('user_id', userid)
        .single();

      if (error) {
        console.error('Error fetching user groups:', error);
      } else {
        const userGroupIds = data.group_name || [];

        if (userGroupIds.length > 0) {
          const { data: groupData, error: groupError } = await supabase
            .from('groups')
            .select('group_id, group_name')
            .in('group_id', userGroupIds);

          if (groupError) {
            console.error('Error fetching group names:', groupError);
          } else {
            const formatted = groupData.map(group => ({
              id: group.group_id,
              name: group.group_name
            }));
            setGroupOptions(formatted);
          }
        }
      }
    };

    if (userid) fetchUserGroups();
  }, [userid]);

  useEffect(() => {
    const fetchDefaultGroup = async () => {
      try {
        const response = await fetch(`http://localhost:5001/api/get-default-group?userid=${userid}`);
        const data = await response.json();
        setGroupName(data.group || null);
      } catch (error) {
        console.error('Error fetching default group:', error);
        setGroupName(null);
      } finally {
        setLoading(false);
      }
    };

    if (userid) fetchDefaultGroup();
  }, [userid]);

  useEffect(() => {
    const fetchEvents = async () => {
      if (!groupName) return;

      const { data: eventsData, error: eventsError } = await supabase
        .from('events')
        .select('user_id, aura_points, description')
        .eq('is_approved', true)
        .eq('group_name', groupName)
        .order('time_created', { ascending: false });

      if (eventsError) {
        console.error('Error fetching events:', eventsError);
        return;
      }

      const enriched = await Promise.all(eventsData.map(async (event) => {
        const { data: userData } = await supabase
          .from('users')
          .select('name')
          .eq('user_id', event.user_id)
          .single();

        return {
          user: {
            name: userData?.name || 'Unknown',
          },
          auraChange: event.aura_points,
          description: event.description,
        };
      }));

      setHistoryData(enriched);
    };

    if (groupName) fetchEvents();
  }, [groupName]);

  const handleGroupChange = (selectedGroupId) => {
    setGroupName(selectedGroupId);
  };

  const getDisplayGroupName = (groupId) => {
    const found = groupOptions.find(option => option.id === groupId);
    return found ? found.name : "Select Group";
  };

  if (loading) return null;

  if (!groupName) {
    return (
      <div className="text-center" style={{ marginTop: '50px', fontSize: '1.2rem' }}>
        You haven't joined any groups yet! Join or create one{' '}
        <Link to={`/groups/${userid}`} style={{ textDecoration: 'underline' }}>here</Link>.
      </div>
    );
  }

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Aura Events History</h1>

        {groupOptions.length > 0 && (
          <Dropdown onSelect={handleGroupChange}>
            <Dropdown.Toggle variant="light" style={{
              backgroundColor: '#f1f1f1',
              borderRadius: '9999px',
              padding: '8px 16px',
              fontWeight: 'bold',
              border: 'none'
            }}>
              {getDisplayGroupName(groupName)}
            </Dropdown.Toggle>

            <Dropdown.Menu>
              {groupOptions.map(group => (
                <Dropdown.Item key={group.id} eventKey={group.id}>
                  {group.name}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>
        )}
      </div>

      <Card className="mb-4 history-card">
        <Card.Header className="bg-white">
          <h5 className="mb-0 fw-bold">Recent Activity</h5>
        </Card.Header>
        <ListGroup variant="flush">
          {historyData.length === 0 ? (
            <ListGroup.Item>No events found for this group.</ListGroup.Item>
          ) : (
            historyData.map((item, index) => (
              <HistoryItem key={index} {...item} />
            ))
          )}
        </ListGroup>
      </Card>
    </>
  );
};

export default History;
