const express = require('express');
const serverless = require('serverless-http');
const axios = require('axios');
const bodyParser = require('body-parser');
const cors = require('cors');
// If using environment variables
// require('dotenv').config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

const clientId = 'exd8bjRBTYSxXxyxqsmMw';
const clientSecret = 'F95ktGMTTydfxiiT1fdGCxbVwiK9Rgj1';
const accountId = 'Txr37ACvRF2XxNrYh7wXAg';
const zoomApiBaseUrl = 'https://api.zoom.us';
const zoomAuthUrl = `${zoomApiBaseUrl}/oauth/token`;
const zoomMeetingUrl = 'https://api.zoom.us/v2/users/me/meetings';

const router = express.Router();

// Endpoint to fetch Zoom access token
router.post('/zoom-token', async (req, res) => {
  try {
    const response = await axios.post(
      `${zoomAuthUrl}?grant_type=account_credentials&account_id=${accountId}`,
      {},
      {
        headers: {
          Authorization: 'Basic ' + Buffer.from(`${clientId}:${clientSecret}`).toString('base64'),
        },
      }
    );
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching Zoom access token:', error);
    res.status(500).send('Failed to fetch Zoom access token');
  }
});

// Endpoint to create a Zoom meeting
router.post('/create-zoom-meeting', async (req, res) => {
  const { accessToken, date, time } = req.body;

  try {
    const response = await axios.post(
      zoomMeetingUrl,
      {
        topic: 'New Meeting',
        type: 2, // Scheduled meeting
        start_time: `${date}T${time}:00Z`, // Start time in ISO format
        duration: 60, // Duration in minutes
        timezone: 'UTC',
        settings: {
          join_before_host: true,
          approval_type: 0, // Automatically approve
          audio: 'both',
          auto_recording: 'cloud',
        },
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error('Error creating Zoom meeting:', error.response ? error.response.data : error.message);
    res.status(500).send('Failed to create Zoom meeting');
  }
});

app.use('/api', router); // Mount the router at /api

// For local development
if (require.main === module) {
  const port = 3000;
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
} else {
  // For Vercel
  module.exports = serverless(app);
}
