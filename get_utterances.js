const axios = require('axios');

const TOKEN = 'VXKCGG6FM52I2EOOD6CQK22X532RYYOJ'; // Replace with your actual token

const getUtterances = async () => {
  const url = 'https://api.wit.ai/utterances?v=20230215&limit=550';
  const headers = {
    Authorization: `Bearer ${TOKEN}`
  };

  try {
    const response = await axios.get(url, { headers });
    console.log('Utterances:', response.data.length);
  } catch (error) {
    console.error('Error fetching utterances:', error.response?.data || error.message);
  }
};

getUtterances();