import React from 'react';
import { Button, Box, Typography } from '@mui/material';
import MailIcon from '@mui/icons-material/Mail';

const GmailAccess = ({ onAuthSuccess }) => {
  const handleGmailAuth = () => {
    window.location.href = 'http://localhost:5000/api/auth/gmail'; // Redirect to backend Gmail auth route
  };

  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('authSuccess') === 'true') {
      onAuthSuccess();
    }
  }, [onAuthSuccess]);

  return (
    <Box sx={{ textAlign: 'center', marginBottom: 3 }}>
      <Typography variant="h6">Connect to Gmail</Typography>
      <Button variant="contained" onClick={handleGmailAuth}>
        <MailIcon sx={{ marginRight: 1 }} />  {/* Add MailIcon inside button */}
        Authenticate Gmail
      </Button>

      {/* New paragraph about the app */}
      <Box sx={{ marginTop: 3 }}>
        <Typography variant="body1" paragraph>
          FundLink is an innovative platform designed to connect people with the financial resources they need.
          Our goal is to bridge the gap between fund seekers and potential investors in an easy, secure, and
          transparent manner.
        </Typography>
        <Typography variant="body1" paragraph>
          By integrating Gmail authentication, FundLink ensures a seamless and secure experience for all users,
          allowing you to manage your profile and communicate effectively with potential funders.
        </Typography>
      </Box>
    </Box>
  );
};

export default GmailAccess;
