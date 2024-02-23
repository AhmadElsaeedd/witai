const fs = require('fs');
const axios = require('axios');
const path = require('path');

// Replace with your actual token
const TOKEN = 'VXKCGG6FM52I2EOOD6CQK22X532RYYOJ';

// Function to read the CSV file and parse it into an array of objects
const parseCSV = async (filePath) => {
  const data = await fs.promises.readFile(filePath, 'utf8');
  const lines = data.split('\n').slice(1); // Skip the header line

  return lines.map(line => {
    // Match all text within quotes or non-comma sequences outside of quotes
    const matches = line.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g);
    if (!matches) return null;

    // Remove quotes and trim whitespace
    const [text, intent] = matches.map(cell => cell.trim().replace(/^"|"$/g, ''));
    return { text, intent };
  }).filter(record => record && record.text && record.intent); // Filter out any empty or malformed rows
};

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

// Function to send the POST request to Wit.ai for each utterance with delay
const sendUtterances = async (utterances) => {
    const url = 'https://api.wit.ai/utterances?v=20230215';
    const headers = {
      Authorization: `Bearer ${TOKEN}`,
      'Content-Type': 'application/json'
    };
  
    // Calculate delay based on rate limit (200 calls per minute -> 300ms between calls)
    const delayInMs = 300;
  
    for (const utterance of utterances) {
      const body = JSON.stringify([{
        text: utterance.text,
        intent: utterance.intent,
        entities: [], // No entities included as per the requirement
        traits: []
      }]);
  
      try {
        const response = await axios.post(url, body, { headers });
        console.log(`Sent utterance for intent "${utterance.intent}" successfully:`, response.data);
      } catch (error) {
        console.error(`Error sending utterance for intent "${utterance.intent}":`, error.response?.data || error.message);
      }
  
      // Wait for the specified delay before making the next call
      await delay(delayInMs);
    }
  };

// Main function to run the script
const main = async () => {
  const filePath = path.join(__dirname, 'customer_responses_combined.csv');
  const utterances = await parseCSV(filePath);
  
  // Test with only the first 5 utterances
  const testUtterances = utterances.slice(0, 5);
  
  await sendUtterances(testUtterances);
};

main();