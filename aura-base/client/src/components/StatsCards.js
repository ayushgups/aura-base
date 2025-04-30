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
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      if (!groupName) {
        console.log('No groupName provided');
        return;
      }

      console.log('Fetching stats for group:', groupName);

      const { data: events, error } = await supabase
        .from('events')
        .select('user_id, name, aura_points, time_created, is_approved')
        .eq('group_name', groupName)
        .eq('is_approved', true);

      if (error) {
        console.error('Supabase error:', error);
        setError(error.message);
        return;
      }

      console.log('Fetched events:', events);

      if (!events || events.length === 0) {
        console.log('No events found');
        setStats({
          winner: { name: 'No Winner Yet', total: 0 },
          shitter: { name: 'No Shitter Yet', total: 0 },
          gainer: { name: 'No Gainer Yet', total: 0 },
          currentUser: { name: 'Your Aura', total: 0 }
        });
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

      console.log('Calculated totals:', totals);
      console.log('Recent gains:', recentGains);

      const sorted = Object.entries(totals)
        .map(([user_id, { name, total }]) => ({ user_id, name, total }))
        .sort((a, b) => b.total - a.total);

      console.log('Sorted users:', sorted);

      // Add safety checks
      const winner = sorted.length > 0 ? sorted[0] : { name: 'No Winner Yet', total: 0 };
      const shitter = sorted.length > 0 ? sorted[sorted.length - 1] : { name: 'No Shitter Yet', total: 0 };
      
      const gainers = Object.entries(recentGains)
        .map(([name, total]) => ({ name, total }))
        .sort((a, b) => b.total - a.total);
      
      const gainer = gainers.length > 0 ? gainers[0] : { name: 'No Recent Gains', total: 0 };

      const current = totals[userid]
        ? { name: totals[userid].name, total: totals[userid].total }
        : { name: 'Your Aura', total: 0 };

      const statsData = {
        winner,
        shitter,
        gainer,
        currentUser: current
      };

      console.log('Final stats:', statsData);
      setStats(statsData);
    };

    fetchStats();
  }, [groupName, userid]);

  if (error) {
    return <div className="text-danger">Error loading stats: {error}</div>;
  }

  if (!stats) return <div>Loading stats...</div>;

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
