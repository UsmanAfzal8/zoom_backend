const axios = require('axios');

module.exports = async (req, res) => {
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.status(204).end();
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).send('Method Not Allowed');
    return;
  }

  res.setHeader('Access-Control-Allow-Origin', '*');

  const { accessToken, date, time } = req.body || {};

  if (!accessToken || !date || !time) {
    res.status(400).send('Missing required fields');
    return;
  }

  try {
    const response = await axios.post(
      'https://api.zoom.us/v2/users/me/meetings',
      {
        topic: 'New Meeting',
        type: 2,
        start_time: `${date}T${time}:00Z`,
        duration: 60,
        timezone: 'UTC',
        settings: {
          join_before_host: true,
          approval_type: 0,
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

    res.status(200).json(response.data);
  } catch (error) {
    console.error('Error creating Zoom meeting:', error.response?.data || error.message);
    res.status(500).send('Failed to create Zoom meeting');
  }
};