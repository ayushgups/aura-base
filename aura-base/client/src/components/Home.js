import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Typography } from '@mui/material';
import './Home.css';

const Home = () => {
  const navigate = useNavigate();

  const handleGoogleSignIn = () => {
    navigate('/login');
  };

  return (
    <Box className="login-container">
      <Box className="login-content">
        <Box className="login-wrapper">
          <img src="/logo.png" alt="AuraBase Logo" className="logo" />
          <Box className="text-button-group">
            <Typography 
              variant="h1" 
              className="logo-text"
              sx={{
                background: 'linear-gradient(90deg, #4169E1, #FF1493)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontWeight: 'bold',
                display: 'block',
                width: '100%'
              }}
            >
              AuraBase
            </Typography>
            <Button
              variant="text"
              onClick={handleGoogleSignIn}
              className="google-sign-in"
              sx={{
                color: 'white',
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,0.1)'
                }
              }}
            >
              Sign In
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Home; 