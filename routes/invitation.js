// const express = require('express');
// const bodyParser = require('body-parser');
// const axios = require('axios');

// const app = express();
// const port = 3000; // Set your desired port

// // Middleware to parse URL-encoded and JSON bodies
// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(bodyParser.json());

// // Replace 'YOUR_BOT_TOKEN' with your actual bot token
// const botToken = '6223171691:AAHxCmwnExLxmcrd10do-lLtbtifwpZPcPQ';

// // Route to handle the redirect URL
// app.get('/redirect', async (req, res) => {
//     const { chatId, userId } = req.query;

//     // Use the Telegram Bot API to add the user to the group
//     try {
//         const response = await axios.post(`https://api.telegram.org/bot${botToken}/addChatMember`, {
//             chat_id: chatId,
//             user_id: userId,
//         });

//         if (response.data.ok) {
//             res.send('User successfully added to the group.');
//         } else {
//             res.status(500).send('Failed to add user to the group.');
//         }
//     } catch (error) {
//         console.error(error);
//         res.status(500).send('Error occurred.');
//     }
// });

// app.listen(port, () => {
//     console.log(`Server is running on port ${port}`);
// });
