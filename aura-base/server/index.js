const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { createClient } = require('@supabase/supabase-js');

// Load env variables
dotenv.config();

const app = express();
const PORT = 5001;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to Supabase
const database = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

// ADDING EVENT
app.post('/api/add-event', async (req, res) => {
  const { name, auraPoints, description } = req.body;

  try {
    // Step 1: Get user information from users table
    const { data: user, error: userError } = await database
      .from('users')
      .select('user_id, group_name')
      .eq('name', name)
      .single();

    if (userError || !user) {
      return res.status(400).json({ error: 'User not found in database' });
    }

    // Step 2: Insert event into events table
    console.log('Inserting event:', {
      name,
      user_id: user.user_id,
      aura_points: parseInt(auraPoints),
      description,
      group_name: user.group_name,
      is_approved: false
    });
    
    const { data, error } = await database
      .from('events')
      .insert([
        {
          name,
          user_id: user.user_id,
          aura_points: parseInt(auraPoints),
          description,
          group_name: user.group_name,
          is_approved: false
        }
      ]);

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    res.status(201).json({ message: 'Event added successfully', data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/dashboard-results', async (req, res) => {
  try {
    const { group_id } = req.query;

    if (!group_id) {
      return res.status(400).json({ error: 'Missing group_id parameter' });
    }

    console.log('Group ID:', group_id);

    const { data, error } = await database
      .from('events') // replace with your table name
      .select('name, aura_points')
      .eq('group_name', group_id)
      .eq('is_approved', true);

    console.log('Data:', data);

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    // Group and sum aura points by user name
    const userTotals = {};

    data.forEach(event => {
      const { name, aura_points } = event;
      if (!userTotals[name]) {
        userTotals[name] = 0;
      }
      userTotals[name] += aura_points;
    });

    // Convert into array and sort descending by total aura points
    const topUsers = Object.entries(userTotals)
      .map(([name, total_aura_points]) => ({ name, total_aura_points }))
      .sort((a, b) => b.total_aura_points - a.total_aura_points)
      .slice(0, 5); // Get top 5

    res.status(200).json(topUsers);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/get-default-group', async (req, res) => {
  try {
    const { userid } = req.query;

    if (!userid) {
      return res.status(400).json({ error: 'Missing userid parameter' });
    }

    const { data, error } = await database
      .from('users')
      .select('group_name')
      .eq('user_id', userid)
      .single(); // only 1 user per UUID

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    if (!data || !data.group_name || data.group_name.length === 0) {
      return res.status(200).json({}); // return empty object if no group
    }

    const firstGroupName = data.group_name[0];
    console.log('First group name:', firstGroupName);
    res.status(200).json({ group: firstGroupName });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// GET THE TABLE
app.get('/api/get-events', async (req, res) => {
  try {
    const { data, error } = await database
      .from('events')
      .select('*')
      .order('time_created', { ascending: false });

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Root route
app.get('/', (req, res) => {
  res.send('Backend is running!');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
