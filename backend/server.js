require('dotenv').config(); // Load environment variables from .env file
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');

// Create an Express application
const app = express();
app.use(bodyParser.json());
app.use(cors());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('Error connecting to MongoDB:', err));

// Vendor Schema
const vendorSchema = new mongoose.Schema({
  name: String,
  dailySales: Number,
  goodsType: String,
});

const Vendor = mongoose.model('Vendor', vendorSchema);

// Load credentials from config
const credentials = require(path.join(__dirname, 'config', 'credentials.json'));
const { client_id, client_secret, redirect_uris } = credentials.web;
const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

// Function to get Google API access token
const getGoogleAuthUrl = () => {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: [
      'https://www.googleapis.com/auth/gmail.readonly',
      'https://www.googleapis.com/auth/gmail.modify',
    ],
  });
  return authUrl;
};

// Route to initiate Gmail OAuth2 authentication
app.get('/api/auth/gmail', (req, res) => {
  const authUrl = getGoogleAuthUrl();
  res.redirect(authUrl); // Redirect the user to Gmail auth URL
});

// OAuth2 callback route
app.get('/api/gmail-callback', async (req, res) => {
  const { code } = req.query;
  try {
    const { tokens } = await oAuth2Client.getToken(code);
    oAuth2Client.setCredentials(tokens);

    // Save the token in a file
    fs.writeFileSync(process.env.TOKENS_PATH, JSON.stringify(tokens));

    // Redirect to the frontend with a success flag
    res.redirect('http://localhost:3000?authSuccess=true');
  } catch (error) {
    console.error('Error getting Gmail token:', error);
    res.status(500).send('Error during Gmail authentication');
  }
});

// Middleware to check if the user is authenticated
const isAuthenticated = (req, res, next) => {
  try {
    const tokens = JSON.parse(fs.readFileSync(process.env.TOKENS_PATH));
    if (!tokens || !tokens.access_token) {
      return res.status(401).send('Unauthorized: Please authenticate via Gmail');
    }
    next();
  } catch (error) {
    return res.status(401).send('Unauthorized: Please authenticate via Gmail');
  }
};

// Filter and fetch financial emails based on keywords
const getFilteredEmails = async () => {
  const keywords = [
    'loan', 'statement', 'Payment successful', 'Payment received',
    'Payment due', 'Transaction alert', 'Transaction summary',
    'Credit', 'Debit', 'Invoice', 'Bill', 'Invoice due',
    'Billing statement', 'Outstanding amount', 'Account statement',
    'Bank alert', 'Deposit received', 'Withdrawal', 'Account balance',
    'Receipt', 'Acknowledgment', 'Payment confirmation', 'Cashback',
    'Reward points', 'Interest rate', 'Limited time offer',
    'Tax invoice', 'GST', 'Tax payment', 'Income tax',
    'Refund processed', 'Refund issued', 'Dispute resolved'
  ];

  const gmail = google.gmail({ version: 'v1', auth: oAuth2Client });
  try {
    // Fetch more emails
    const res = await gmail.users.messages.list({
      userId: 'me',
      labelIds: ['INBOX'],
      maxResults: 50, // Increased maxResults to 50
    });

    const messages = res.data.messages;
    console.log('Total emails:', messages.length); // Log total emails returned

    if (messages && messages.length) {
      const filteredEmails = [];

      for (const message of messages) {
        const msgRes = await gmail.users.messages.get({
          userId: 'me',
          id: message.id,
        });

        const emailData = msgRes.data.payload.headers;
        const subjectHeader = emailData.find(header => header.name === 'Subject');
        const snippet = msgRes.data.snippet;

        // Check for matching keywords in the subject or snippet
        const isMatch = keywords.some(keyword =>
          (subjectHeader && subjectHeader.value.toLowerCase().includes(keyword)) ||
          snippet.toLowerCase().includes(keyword)
        );

        if (isMatch) {
          filteredEmails.push({
            id: message.id,
            subject: subjectHeader ? subjectHeader.value : 'No Subject',
            snippet,
          });
        }
      }

      return filteredEmails;
    } else {
      console.log('No messages found.');
      return [];
    }
  } catch (error) {
    console.error('Error fetching messages:', error);
    return [];
  }
};

// Route to fetch filtered financial emails
app.get('/api/filtered-emails', async (req, res) => {
  const emails = await getFilteredEmails();
  res.json(emails);
});

// Vendor Data Route - Authentication required
app.post('/api/vendors', isAuthenticated, async (req, res) => {
  const vendor = new Vendor(req.body);
  try {
    await vendor.save();
    res.status(201).send('Vendor data saved successfully!');
  } catch (error) {
    console.error('Error saving vendor data:', error);
    res.status(500).send('Error saving vendor data');
  }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
