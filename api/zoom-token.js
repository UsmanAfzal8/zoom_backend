const axios = require('axios');

const clientId =  'exd8bjRBTYSxXxyxqsmMw';
const clientSecret = 'F95ktGMTTydfxiiT1fdGCxbVwiK9Rgj1';
const accountId =  'Txr37ACvRF2XxNrYh7wXAg';
const zoomAuthUrl = 'https://api.zoom.us/oauth/token';

module.exports = async (req, res) => {
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.status(204).end();
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).send('Method Not Allowed');
    return;
  }

  res.setHeader('Access-Control-Allow-Origin', '*');

  try {
    const response = await axios.post(
      `${zoomAuthUrl}?grant_type=account_credentials&account_id=${accountId}`,
      {},
      {
        headers: {
          Authorization:
            'Basic ' + Buffer.from(`${clientId}:${clientSecret}`).toString('base64'),
        },
      }
    );
    res.status(200).json(response.data);
  } catch (error) {
    console.error('Error fetching Zoom access token:', error.response?.data || error.message);
    res.status(500).send('Failed to fetch Zoom access token');
  }
};