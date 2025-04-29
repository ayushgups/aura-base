import React, { useEffect, useState } from 'react';
import { Card, ListGroup } from 'react-bootstrap';
import { FaArrowUp, FaArrowDown } from 'react-icons/fa';
import Avatar from './Avatar';
import supabase from '../helper/supabaseClient';
import './History.css';

const HistoryItem = ({ user, auraChange, description }) => (
  <ListGroup.Item className="history-item">
    <div className="d-flex align-items-start">
      <Avatar name={user.name} size={45} /> {/* ✅ Use Avatar component */}
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
  const [historyData, setHistoryData] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      const { data: eventsData, error: eventsError } = await supabase
        .from('events')
        .select('user_id, aura_points, description')
        .eq("is_approved", true)
        .order('time_created', { ascending: false }); // optional: newest first

      if (eventsError) {
        console.error('Error fetching events:', eventsError);
        return;
      }

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
          auraChange: event.aura_points,
          description: event.description,
        };
      }));

      setHistoryData(enriched);
    };

    fetchEvents();
  }, []);

  return (
    <Card className="mb-4 history-card">
      <Card.Header className="bg-white">
        <h5 className="mb-0 fw-bold">Aura Events History</h5>
      </Card.Header>
      <ListGroup variant="flush">
        {historyData.map((item, index) => (
          <HistoryItem key={index} {...item} />
        ))}
      </ListGroup>
    </Card>
  );
};

export default History;
