"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_fetch_1 = require("node-fetch");
// const { fetch }= require("node-fetch"); 
async function setBotCommands(botToken, commands) {
    const url = `https://api.telegram.org/bot${botToken}/setMyCommands`;
    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            commands: commands,
        }),
    };
    try {
        const response = await (0, node_fetch_1.fetch)(url, requestOptions);
        const data = await response.json();
        console.log('Commands set successfully:', JSON.stringify(data));
    }
    catch (error) {
        console.error('Error setting commands:', error);
    }
}
module.exports = setBotCommands;
// // Your existing command handlers
// bot.command('/start', (ctx) => {
//   ctx.reply('Welcome to the bot!');
// });
// bot.command('/help', (ctx) => {
//   ctx.reply('This is the help message.');
// });
// bot.command('/info', (ctx) => {
//   ctx.reply('This is information about the bot.');
// });
// // Call the setBotCommands function with the additional commands
// const additionalCommands = [
//   { command: 'newcommand1', description: 'Description for New Command 1' },
//   { command: 'newcommand2', description: 'Description for New Command 2' },
//   // Add more additional commands here
// ];
// //setBotCommands(token, additionalCommands);
