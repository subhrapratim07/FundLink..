import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Container, Box, Typography } from '@mui/material';
import GmailAccess from './components/GmailAccess';
import Form from './components/Form';
// Import the background image

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleAuthSuccess = () => {
    setIsAuthenticated(true);
  };

  const appStyle = {
    backgroundImage: `url('/background.jpg')`,// Use the imported image
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
  };

  return (
    <div style={appStyle}>
      <Router>
        <Container maxWidth="sm">
          <Box sx={{ textAlign: 'center', marginTop: 4 }}>
            <Typography variant="h2" gutterBottom>
              FundLink 
            </Typography>
            <Typography variant="h4" gutterBottom>
             Vendor Credit Scoring
            </Typography>
            <Routes>
              <Route
                path="/"
                element={
                  isAuthenticated ? (
                    <Navigate to="/vendor-form" />
                  ) : (
                    <GmailAccess onAuthSuccess={handleAuthSuccess} />
                  )
                }
              />
              <Route
                path="/vendor-form"
                element={isAuthenticated ? <Form /> : <Navigate to="/" />}
              />
            </Routes>
          </Box>
        </Container>
      </Router>
    </div>
  );
};

export default App;
