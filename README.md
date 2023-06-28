# text-to-json-openai
A helper to translate user message into a JSON response.

How to run:
- Copy `.env.example` to `.env` and update `OPENAI_API_KEY` value. See https://platform.openai.com/account/api-keys.
- `npm run start` or `node index.js`

Bot:
```html
I can show you either all chats, chats for the latest X days, or the new messages.
```

User message:
```html
I'd like to see all new messages for the last 2 days
```

Model reply:
```json
{
  "request": "I'd like to see all new messages for the last 2 days",
  "reply": "Loading new messages for the last 2 days...",
  "showChats": true,
  "duration": "2 days",
  "onlyNew": true
}
```

JSON schema:
- `request` - what user asks for.
- `reply` - reply to the user to indicate if his input is clear or not.
- `showChats` - true or false, defaults to false.
- `duration` - duration in format "number unit", for example "3 days", "5 hours", "30 mins", defaults to null.
- `onlyNew` - true or false, defaults to false.
