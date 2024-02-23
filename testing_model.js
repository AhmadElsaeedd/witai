const fs = require('fs');
const axios = require('axios');
const path = require('path');
const { parse } = require('papaparse');

const TOKEN = 'VXKCGG6FM52I2EOOD6CQK22X532RYYOJ'; // Replace with your actual token

const testIntents = async (filePath) => {
  const fileContent = fs.readFileSync(filePath, 'utf8');
  parse(fileContent, {
    header: true,
    complete: async (results) => {
      for (const row of results.data) {
        const customerText = encodeURIComponent(row['Customer Text']);
        const expectedIntent = row['Intent'];
        const url = `https://api.wit.ai/message?v=20240223&q=${customerText}`;

        try {
          const response = await axios.get(url, {
            headers: { Authorization: `Bearer ${TOKEN}` }
          });

          const intents = response.data.intents;
          const topIntent = intents[0] || {};
          const isCorrect = topIntent.name === expectedIntent;
          const confidence = topIntent.confidence || 0;

          console.log(`Customer Text: "${row['Customer Text']}"`);
          console.log(`Expected Intent: ${expectedIntent}, Predicted Intent: ${topIntent.name}, Confidence: ${confidence}`);
          console.log(`Result: ${isCorrect ? 'Correct' : 'Incorrect'}\n`);
        } catch (error) {
          console.error('Error fetching intent:', error.response?.data || error.message);
        }
      }
    }
  });
};

const filePath = path.join(__dirname, 'customer_texts_split.csv');
testIntents(filePath);