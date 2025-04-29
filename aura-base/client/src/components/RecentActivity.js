import React, { useEffect, useState } from 'react';
import { Card, ListGroup } from 'react-bootstrap';
import { FaArrowUp, FaArrowDown } from 'react-icons/fa';
import Avatar from './Avatar';
import supabase from '../helper/supabaseClient';
import './RecentActivity.css';

const RecentActivityItem = ({ user, auraChange, description }) => (
  <ListGroup.Item className="recent-activity-item">
    <div className="d-flex align-items-start">
      <Avatar name={user.name} size={45} />
      <div className="activity-content ms-3">
        <div className="d-flex justify-content-between align-items-center mb-1">
          <div className="activity-user">{user.name}</div>
          <div className="activity-aura">
            {auraChange > 0 ? (
              <>
                <FaArrowUp className="text-success" />
                <span className="text-success ms-1">+{auraChange} Aura</span>
              </>
            ) : (
              <>
                <FaArrowDown className="text-danger" />
                <span className="text-danger ms-1">{auraChange} Aura</span>
              </>
            )}
          </div>
        </div>
        <div className="activity-description text-muted">{description}</div>
      </div>
    </div>
  </ListGroup.Item>
);

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
    <Card className="mb-4 recent-activity-card">
      <Card.Header className="bg-white">
        <h5 className="mb-0 fw-bold">Recent Activity</h5>
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
