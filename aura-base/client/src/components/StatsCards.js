import React, { useEffect, useState } from 'react';
import { Card } from 'react-bootstrap';
import { FaCrown, FaPoop, FaFire, FaUser } from 'react-icons/fa';
import './StatsCards.css';
import supabase from '../helper/supabaseClient';
import { useParams } from 'react-router-dom';

const StatsCard = ({ icon, value, label, iconClass }) => (
  <div className="stat-item">
    <div className={`stat-circle ${iconClass}`}>
      <div className="stat-value">{value}</div>
      <div className="stat-icon">{icon}</div>
    </div>
    <div className="stat-label-group">
      <div className="stat-label-title">{label.split(':')[0]}:</div>
      <div className="stat-label-name">{label.split(':')[1]}</div>
    </div>
  </div>
);

const StatsCards = ({ groupName }) => {
  const { userid } = useParams();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      if (!groupName) return;

      const { data: events, error } = await supabase
        .from('events')
        .select('user_id, name, aura_points, time_created, is_approved')
        .eq('group_name', groupName)
        .eq('is_approved', true);

      if (error) {
        console.error('Supabase error:', error);
        return;
      }

      const now = new Date();
      const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);

      // Aggregate aura points by user
      const totals = {};
      const recentGains = {};

      events.forEach(event => {
        const key = event.user_id;
        if (!totals[key]) totals[key] = { name: event.name, total: 0 };
        totals[key].total += event.aura_points;

        const createdAt = new Date(event.time_created);
        const createdTime = createdAt.getTime();

        if (!isNaN(createdTime) && createdTime > oneHourAgo.getTime()) {
          if (!recentGains[event.name]) recentGains[event.name] = 0;
          recentGains[event.name] += event.aura_points;
        }
      });

      const sorted = Object.entries(totals)
        .map(([user_id, { name, total }]) => ({ user_id, name, total }))
        .sort((a, b) => b.total - a.total);

      const winner = sorted[0];
      const shitter = sorted[sorted.length - 1];
      const gainer = Object.entries(recentGains)
        .map(([name, total]) => ({ name, total }))
        .sort((a, b) => b.total - a.total)[0];

      const current = totals[userid]
        ? { name: totals[userid].name, total: totals[userid].total }
        : { name: 'Your Aura', total: 0 };

      setStats({
        winner,
        shitter,
        gainer: gainer || { name: 'N/A', total: 0 },
        currentUser: current
      });
    };

    fetchStats();
  }, [groupName, userid]);

  if (!stats) return null;

  return (
    <Card className="stats-container">
      <Card.Body className="p-0">
        <div className="stats-grid">
          <StatsCard
            icon={<FaCrown />}
            value={stats.winner.total}
            label={`Current Winner:${stats.winner.name}`}
            iconClass="crown"
          />
          <StatsCard
            icon={<FaPoop />}
            value={stats.shitter.total}
            label={`Current Shitter:${stats.shitter.name}`}
            iconClass="poop"
          />
          <StatsCard
            icon={<FaFire />}
            value={`+${stats.gainer.total}`}
            label={`Biggest Gainer:${stats.gainer.name}`}
            iconClass="fire"
          />
          <StatsCard
            icon={<FaUser />}
            value={stats.currentUser.total}
            label={`Current Aura:${stats.currentUser.name}`}
            iconClass="user"
          />
        </div>
      </Card.Body>
    </Card>
  );
};

export default StatsCards;
