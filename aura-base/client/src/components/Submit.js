import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Select,
  MenuItem,
  Paper
} from '@mui/material';
import { useParams, Link } from 'react-router-dom';
import supabase from '../helper/supabaseClient';
import './Submit.css';

const Submit = () => {
  const { userid } = useParams();

  const [formData, setFormData] = useState({
    name: '',
    auraPoints: '',
    description: ''
  });

  const [peopleOptions, setPeopleOptions] = useState([]);
  const [groupName, setGroupName] = useState(null); // selected group_id
  const [groupOptions, setGroupOptions] = useState([]); // [{ id, name }]
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
        const groupIds = data.group_name || [];

        if (groupIds.length > 0) {
          const { data: groupData, error: groupError } = await supabase
            .from('groups')
            .select('group_id, group_name')
            .in('group_id', groupIds);

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

    fetchUserGroups();
  }, [userid]);

  useEffect(() => {
    const fetchDefaultGroup = async () => {
      try {
        const response = await fetch(`http://localhost:5001/api/get-default-group?userid=${userid}`);
        const data = await response.json();
        setGroupName(data.group || null);
      } catch (err) {
        console.error('Error fetching default group:', err);
        setGroupName(null);
      } finally {
        setLoading(false);
      }
    };

    if (userid) fetchDefaultGroup();
  }, [userid]);

  useEffect(() => {
    const fetchPeopleMap = async () => {
      if (!groupName) return;

      const { data, error } = await supabase
        .from('groups')
        .select('people_map')
        .eq('group_id', groupName)
        .single();

      if (error) {
        console.error('Error fetching people map:', error);
      } else if (data?.people_map) {
        const formatted = Object.entries(data.people_map).map(([id, name]) => ({ id, name }));
        setPeopleOptions(formatted);
      }
    };

    fetchPeopleMap();
  }, [groupName]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleGroupChange = (e) => {
    setGroupName(e.target.value);
    setFormData(prev => ({ ...prev, name: '' })); // reset person on group change
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:5001/api/add-event', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          group_name: groupName // important to include the selected group
        })
      });

      const result = await response.json();

      if (response.ok) {
        alert('Event submitted successfully!');
        setFormData({ name: '', auraPoints: '', description: '' });
      } else {
        alert('Error: ' + result.error);
      }
    } catch (err) {
      console.error('Submission failed:', err);
      alert('Network error submitting event.');
    }
  };

  if (loading) return null;

  if (!groupName) {
    return (
      <Box sx={{ textAlign: 'center', mt: 8 }}>
        <Typography variant="h6">
          You haven't joined any groups yet! Join or create one{' '}
          <Link to={`/groups/${userid}`} style={{ textDecoration: 'underline' }}>
            here
          </Link>.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 4, maxWidth: 600, mx: 'auto', mt: 6 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold', mb: 4 }}>
        Submit an Event
      </Typography>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2, backgroundColor: '#fff' }}>
        <form onSubmit={handleSubmit}>
          {/* Group Dropdown */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 500 }}>
              Group
            </Typography>
            <Select
              fullWidth
              value={groupName}
              onChange={handleGroupChange}
              displayEmpty
              sx={{ backgroundColor: '#f5f5f5', borderRadius: 1 }}
            >
              {groupOptions.map((g) => (
                <MenuItem key={g.id} value={g.id}>
                  {g.name}
                </MenuItem>
              ))}
            </Select>
          </Box>

          {/* Person Dropdown */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 500 }}>
              Person
            </Typography>
            <Select
              fullWidth
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              displayEmpty
              sx={{ backgroundColor: '#f5f5f5', borderRadius: 1 }}
            >
              <MenuItem value="" disabled>
                Select a person
              </MenuItem>
              {peopleOptions.map((p) => (
                <MenuItem key={p.id} value={p.name}>
                  {p.name}
                </MenuItem>
              ))}
            </Select>
          </Box>

          {/* Aura Points Input */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 500 }}>
              Amount of Aura
            </Typography>
            <TextField
              fullWidth
              type="number"
              name="auraPoints"
              value={formData.auraPoints}
              onChange={handleChange}
              required
              placeholder="Enter aura points"
              sx={{ backgroundColor: '#f5f5f5', borderRadius: 1 }}
            />
          </Box>

          {/* Description Field */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 500 }}>
              Description
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={4}
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              placeholder="Describe the event"
              sx={{ backgroundColor: '#f5f5f5', borderRadius: 1 }}
            />
          </Box>

          {/* Submit Button */}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              type="submit"
              variant="contained"
              size="large"
              sx={{
                backgroundColor: '#1e73e5',
                px: 4,
                py: 1.5,
                fontWeight: 'bold',
                '&:hover': { backgroundColor: '#155cc1' }
              }}
            >
              SEND
            </Button>
          </Box>
        </form>
      </Paper>
    </Box>
  );
};

export default Submit;
