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
