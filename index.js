require('dotenv').config();
const axios = require('axios');

// region DATA
const systemMessage = `You are a programmer. Always reply in JSON format.`

const userExampleMessage = `A table summarizing who wants to see their chats (messages or rooms). 
For how many days. And only new or not. If person doesn't want to see the chats, ignore Duration and Only New.

Five columns:
- Person - user id string.
- Request - what user asks for.
- Reply - reply to the user to indicate if his input is clear or not.
- Show Chats - true or false, defaults to false.
- Duration - duration in format "number unit", for example "3 days", "5 hours", "30 mins", defaults to null.
- Only New - true or false, defaults to false.

Return in JSON format where "person" is a key and "request", "reply", "showChats", "duration", "onlyNew" are the key value pairs.
Show all fields always even though they equal to default values.

Max: I want to count elephants
Nina: Show me your pictures
Martin: Show me my messages
Artur: I'd like to see all new chats
Fred: Show me chats for 3 days
`;

const assistantReplyMessage = `{
  "Max": {
    "request": "I want to count elephants",
    "reply": "I don't understand the command. I can show you either all chats, chats for the latest X days, or the new messages.",
    "showChats": false,
    "duration": null,
    "onlyNew": false
  },
  "Nina": {
    "request": "Show me your pictures",
    "reply": "I don't understand the command. I can show you either all chats, chats for the latest X days, or the new messages.",
    "showChats": false,
    "duration": null,
    "onlyNew": false
  },
  "Martin": {
    "request": "Show me my messages",
    "reply": "Loading all the chats you have...",
    "showChats": true,
    "duration": null,
    "onlyNew": false
  },
  "Artur": {
    "request": "I'd like to see all new chats",
    "reply": "Loading new messages you've got...",
    "showChats": true,
    "duration": null,
    "onlyNew": true
  },
  "Fred": {
    "request": "Show me chats for 3 days",
    "reply": "Loading the chats for the last 3 days...",
    "showChats": true,
    "duration": "3 days",
    "onlyNew": false
  }
}`
// endregion

// `process.argv[0]` and `process.argv[1]` represent the Node.js executable and the script file path, respectively.
const scriptArgs = process.argv.slice(2);
// If script is run with arguments, apply them as the input, otherwise use the default message.
// Example of how to provide arguments: `node index.js "This is an example"`
const userInput = scriptArgs.length > 0 ? scriptArgs[0] : "I'd like to see all new messages for the last 2 days"
const userMessage = `user: ${userInput}`

async function convertTextToJson(userText) {
  const apiKey = process.env.OPENAI_API_KEY;
  const endpoint = 'https://api.openai.com/v1/chat/completions';

  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${apiKey}`
  };

  const data = {
    messages: [
      { role: 'system', content: systemMessage },
      { role: 'user', content: userExampleMessage },
      { role: 'assistant', content: assistantReplyMessage },
      { role: 'user', content: userText }
    ],
    model: 'gpt-3.5-turbo'
  };

  try {
    const response = await axios.post(endpoint, data, { headers });
    const responseData = response.data;

    // Expect response to be a JSON string
    const modelReply = responseData.choices[0].message.content;
    const json = JSON.parse(modelReply);

    if (!('user' in json)) {
      throw new Error('There is no user info in JSON');
    }

    return json.user;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

convertTextToJson(userMessage)
  .then(jsonData => {
    console.log('User message:', userInput)
    console.log('Model reply:', jsonData);
  })
  .catch(error => {
    console.error('Conversion error:', error);
  });
