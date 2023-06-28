require('dotenv').config();
const axios = require('axios');

async function convertTextToJson(userText) {
  const apiKey = process.env.OPENAI_API_KEY;
  const endpoint = 'https://api.openai.com/v1/chat/completions';

  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${apiKey}`
  };

  const data = {
    messages: [
      { role: 'system', content: 'You are a programmer' },
      { role: 'user', content: userText }
    ],
    model: 'gpt-3.5-turbo'
  };

  try {
    const response = await axios.post(endpoint, data, { headers });
    const responseData = response.data;

    const modelReply = responseData.choices[0].message.content;

    console.log('User message:', userText)
    console.log('Model reply:', modelReply);

    // TODO: validate response
    return modelReply;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

// Example usage
const userText = `A table summarizing who wants to see their chats (messages or rooms). 
For how many days. And only new or not. If person doesn't want to see the chats, ignore Duration and Only New.

Five columns:
- Person
- Request
- Show Chats (true or false. Defaults to false)
- Duration (for example, 3 days, 5 hours, 30 mins. Default to null)
- Only New (Default to false)

Return in JSON format where "person" is a key and "request", "showChats", "duration", "onlyNew" are the key value pairs.
Show all fields always even though they equal to default values.

Max: I want to count elephants
Nina: Show me your pictures
Martin: Show me my messages
Artur: I'd like to see all new chats
Fred: Show me chats for 3 days
`;

convertTextToJson(userText)
  .then(jsonData => {
    // console.log(jsonData); // Output: { showMessages: true }
  })
  .catch(error => {
    console.error('Conversion error:', error);
  });
