import React, { useEffect, useState } from 'react';
import { Card, ListGroup } from 'react-bootstrap';
import { FaArrowUp, FaArrowDown } from 'react-icons/fa';
import Avatar from './Avatar';
import supabase from '../helper/supabaseClient';
import './RecentActivity.css';

// Function to generate consistent colors based on name
const getAvatarColor = (name) => {
  const colors = [
    '#FF9B9B', // Light Red
    '#98FB98', // Light Green
    '#87CEEB', // Sky Blue
    '#DDA0DD', // Plum
    '#F0E68C', // Khaki
    '#E6A8D7', // Light Purple
    '#98FB98', // Pale Green
    '#87CEFA', // Light Sky Blue
    '#FFA07A', // Light Salmon
    '#B0C4DE'  // Light Steel Blue
  ];
  
  // Generate a consistent index based on the name
  const index = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length;
  return colors[index];
};

const RecentActivityItem = ({ user, auraChange, description }) => {
  const initials = user.name.split(' ').map(n => n[0]).join('').toUpperCase();
  const isGain = auraChange > 0;
  const avatarColor = getAvatarColor(user.name);
  
  return (
    <ListGroup.Item className="recent-activity-item">
      <div className="d-flex align-items-start">
        <div className="activity-avatar" style={{ backgroundColor: avatarColor }}>
          {initials}
        </div>
        <div className="activity-content">
          <div className="d-flex justify-content-between align-items-start">
            <div>
              <div className="activity-user">{user.name}</div>
              <div className={`activity-aura ${isGain ? 'gained' : 'lost'}`}>
                {isGain ? 'Gained' : 'Lost'} {Math.abs(auraChange)} Aura
              </div>
            </div>
            {isGain ? (
              <FaArrowUp className="arrow-icon text-success" />
            ) : (
              <FaArrowDown className="arrow-icon text-danger" />
            )}
          </div>
          <div className="activity-description">
            {description}
          </div>
        </div>
      </div>
    </ListGroup.Item>
  );
};

const RecentActivity = ({ groupName }) => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchGroupEvents = async () => {
      if (!groupName) return;

      const { data: eventsData, error } = await supabase
        .from('events')
        .select('user_id, aura_points, description')
        .eq('group_name', groupName)
        .eq('is_approved', true)
        .order('time_created', { ascending: false })
        .limit(3);

      if (error) {
        console.error('Error fetching recent activity:', error);
        return;
      }

      const enriched = await Promise.all(eventsData.map(async (event) => {
        const { data: userData } = await supabase
          .from('users')
          .select('name')
          .eq('user_id', event.user_id)
          .single();

        return {
          user: { name: userData?.name || 'Unknown' },
          auraChange: event.aura_points,
          description: event.description,
        };
      }));

      setEvents(enriched);
    };

    fetchGroupEvents();
  }, [groupName]);

  return (
    <Card className="recent-activity-card">
      <Card.Header>
        <h5>Recent Activity</h5>
      </Card.Header>
      <ListGroup variant="flush">
        {events.length === 0 ? (
          <ListGroup.Item>No recent activity found.</ListGroup.Item>
        ) : (
          events.map((item, idx) => <RecentActivityItem key={idx} {...item} />)
        )}
      </ListGroup>
    </Card>
  );
};

export default RecentActivity;
