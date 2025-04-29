import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Select, MenuItem, Paper } from '@mui/material';
import './Submit.css';

const Submit = () => {
  const [formData, setFormData] = useState({
    name: '',             
    auraPoints: '',       
    description: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const response = await fetch('http://localhost:5001/api/add-event', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
  
      const result = await response.json();
  
      if (response.ok) {
        alert('Event submitted successfully!');
        // Optionally clear the form:
        setFormData({ name: '', auraPoints: '', description: '' });
      } else {
        alert('Error submitting event: ' + result.error);
      }
    } catch (error) {
      console.error('Submission error:', error);
      alert('Network error submitting event.');
    }
  };
  

  return (
    <Box sx={{ p: 4, maxWidth: 800, mx: 'auto' }}>
      <Typography variant="h4" component="h1" gutterBottom>
        <b> Submit an Event </b>
      </Typography>
      <Paper elevation={3} sx={{ p: 4 }}>
        <form onSubmit={handleSubmit}>
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" gutterBottom>
              Person
            </Typography>
            <Select
              fullWidth
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            >
              <MenuItem value="Ayush Gupta">Ayush Gupta</MenuItem>
              {/* Add more people as needed */}
            </Select>
          </Box>

          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" gutterBottom>
              Amount of Aura
            </Typography>
            <TextField
              fullWidth
              type="number"
              name="auraPoints"
              value={formData.auraPoints}
              onChange={handleChange}
              placeholder="Enter a positive or negative number"
              required
            />
          </Box>

          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" gutterBottom>
              Description
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={4}
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter event description"
              required
            />
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="large"
            >
              Send
            </Button>
          </Box>
        </form>
      </Paper>
    </Box>
  );
};

export default Submit;
