import React from 'react';
import { Card, ListGroup } from 'react-bootstrap';
import { FaArrowUp, FaArrowDown } from 'react-icons/fa';
import './RecentActivity.css';
import Avatar from './Avatar.js';
import supabase from '../helper/supabaseClient';

const ActivityItem = ({ user, change, description }) => (
  <ListGroup.Item className="activity-item">
    <div className="d-flex">
      <div className="activity-left d-flex">
        <Avatar name={user.name}/>
        <div className="ms-3">
          <div className="user-info">
            <strong>{user.name}</strong>
            <div className={`aura-change ${change > 0 ? 'gained' : 'lost'}`}>
              {change > 0 ? 'Gained' : 'Lost'} {Math.abs(change)} Aura
            </div>
          </div>
        </div>
      </div>
      
      <div className="arrow-container">
        {change > 0 ? (
          <FaArrowUp className="arrow up" />
        ) : (
          <FaArrowDown className="arrow down" />
        )}
      </div>
      
      <div className="activity-description">
        {description}
      </div>
    </div>
  </ListGroup.Item>
);

const RecentActivity = () => {
  // fetching events dynamically from DB
  const [activities, setActivities] = React.useState([]);

  React.useEffect(() => {
    const fetchActivities = async () => {
      const { data: eventsData, error: eventsError } = await supabase
        .from('events')
        // .select('user_id, aura_points, description');
        .select('user_id, aura_points, description, time_created')
        .order('time_created', { ascending: false })
        .eq("is_approved", true)
        .limit(3);


      if (eventsError) {
        console.error('Error fetching events:', eventsError);
        return;
      }

      // For each event, fetch user's name from users table
      const enriched = await Promise.all(eventsData.map(async (event) => {
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('name')
          .eq('user_id', event.user_id)
          .single();

        return {
          user: {
            name: userData?.name || 'Unknown',
          },
          change: event.aura_points,
          description: event.description,
        };
      }));

      setActivities(enriched);
    };

    fetchActivities();
  }, []);

  return (
    <Card className="mb-4 recent-activity">
      <Card.Header className="bg-white">
        <h5 className="mb-0 fw-bold">Recent Activity</h5>
      </Card.Header>
      <ListGroup variant="flush">
        {activities.map((activity, index) => (
          <ActivityItem key={index} {...activity} />
        ))}
      </ListGroup>
    </Card>
  );
};

export default RecentActivity; 