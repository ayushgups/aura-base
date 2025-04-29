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

app.post('/api/add-event', async (req, res) => {
  const { name, auraPoints, description } = req.body; // name = nominee

  try {
    // Step 1: Lookup nominee's user_id and group_name
    const { data: nomineeUser, error: userError } = await database
      .from('users')
      .select('user_id, group_name')
      .eq('name', name)
      .single();

    if (userError || !nomineeUser) {
      return res.status(400).json({ error: 'Nominee not found in users table' });
    }

    const userIdOfNominee = nomineeUser.user_id;
    const groupName = Array.isArray(nomineeUser.group_name)
      ? nomineeUser.group_name[0]
      : nomineeUser.group_name;

    // Step 2: Insert into events table
    const { data: eventData, error: eventError } = await database
      .from('events')
      .insert([
        {
          name,
          user_id: userIdOfNominee,
          aura_points: parseInt(auraPoints),
          description,
          group_name: groupName,
          is_approved: true
        }
      ])
      .select();

    if (eventError || !eventData || eventData.length === 0) {
      return res.status(500).json({ error: eventError?.message || 'Event insert failed' });
    }

    const eventId = eventData[0].event_id;

    // Step 3: Get people_map for group
    const { data: groupData, error: groupError } = await database
      .from('groups')
      .select('people_map')
      .eq('group_name', groupName)
      .single();

    if (groupError || !groupData || !groupData.people_map) {
      return res.status(500).json({ error: 'Group or people_map not found' });
    }

    const peopleMap = groupData.people_map;

    // Step 4: Build pending entries for reviewers
    const pendingInserts = Object.entries(peopleMap)
      .map(([reviewerId, reviewerName]) => ({
        event_id: eventId,
        approved: false,
        name_of_nominee: name,
        user_id_of_nominee: userIdOfNominee,
        name_of_reviewer: reviewerName,
        user_id_of_reviewer: reviewerId
      }));

    // Step 5: Insert pending entries
    const { error: pendingError } = await database
      .from('pending')
      .insert(pendingInserts);

    if (pendingError) {
      return res.status(500).json({ error: pendingError.message });
    }

    res.status(201).json({ message: 'Event and pending reviews created successfully.' });

  } catch (err) {
    res.status(500).json({ error: err.message });
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

<<<<<<< HEAD
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
=======
app.get('/api/get-default-group', async (req, res) => {
>>>>>>> c210110ff1aa28f4f44ecaf3d7e9c1550aeb5ee2
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

app.post('/api/add-event', async (req, res) => {
  const { name, auraPoints, description } = req.body; // name = nominee

  try {
    // Step 1: Lookup nominee's user_id and group_name
    const { data: nomineeUser, error: userError } = await database
      .from('users')
      .select('user_id, group_name')
      .eq('name', name)
      .single();

    if (userError || !nomineeUser) {
      return res.status(400).json({ error: 'Nominee not found in users table' });
    }

    const userIdOfNominee = nomineeUser.user_id;
    const groupName = Array.isArray(nomineeUser.group_name)
      ? nomineeUser.group_name[0]
      : nomineeUser.group_name;

    // Step 2: Insert into events table
    const { data: eventData, error: eventError } = await database
      .from('events')
      .insert([
        {
          name,
          user_id: userIdOfNominee,
          aura_points: parseInt(auraPoints),
          description,
          group_name: groupName,
          is_approved: false
        }
      ])
      .select();

    if (eventError || !eventData || eventData.length === 0) {
      return res.status(500).json({ error: eventError?.message || 'Event insert failed' });
    }

    const eventId = eventData[0].event_id;

    // Step 3: Get people_map for group
    const { data: groupData, error: groupError } = await database
      .from('groups')
      .select('people_map')
      .eq('group_name', groupName)
      .single();

    if (groupError || !groupData || !groupData.people_map) {
      return res.status(500).json({ error: 'Group or people_map not found' });
    }

    const peopleMap = groupData.people_map;

    // Step 4: Build pending entries for reviewers
    const pendingInserts = Object.entries(peopleMap)
      .map(([reviewerId, reviewerName]) => ({
        event_id: eventId,
        approved: false,
        name_of_nominee: name,
        user_id_of_nominee: userIdOfNominee,
        name_of_reviewer: reviewerName,
        user_id_of_reviewer: reviewerId
      }));

    // Step 5: Insert pending entries
    const { error: pendingError } = await database
      .from('pending')
      .insert(pendingInserts);

    if (pendingError) {
      return res.status(500).json({ error: pendingError.message });
    }

    res.status(201).json({ message: 'Event and pending reviews created successfully.' });

  } catch (err) {
    res.status(500).json({ error: err.message });
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
