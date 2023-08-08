const { Telegraf, Markup } = require('telegraf');
const { Client } = require('pg');
const fs = require('fs');
const { Router } = require('express'); // Add this line to import Router
const setBotCommands = require('./setBotCommands');

const token = "6223171691:AAHxCmwnExLxmcrd10do-lLtbtifwpZPcPQ";

const client = new Client({
  user: 'postgres', // Replace with your PostgreSQL username
  host: 'localhost', // Replace with your PostgreSQL host
  database: 'telegram_bot', // Replace with your database name
  password: 'root', // Replace with your PostgreSQL password
  port: 5432, // Default PostgreSQL port is 5432
});

// Connect to the PostgreSQL database
client.connect();

const bot = new Telegraf(token);
  
// Call the setBotCommands function with the additional commands
const additionalCommands = [
    { command: 'newcommand1', description: 'Description for New Command 1' },
    { command: 'newcommand2', description: 'Description for New Command 2' },
    { command: 'newcommand3', description: 'Description for New Command 3' },
    // Add more additional commands here
];
setBotCommands(token, additionalCommands);

bot.command('power', async (ctx) => {
    ctx.reply('More power to you.');
});

// Handle inline queries
bot.on('inline_query', (query) => {
  const results = [
    {
      type: 'article',
      id: '1',
      title: 'Sample Result',
      input_message_content: {
        message_text: 'This is a sample inline result.'
      }
    }
  ];

  bot.answerInlineQuery(query.id, results);
});

console.log('Bot is running and listening for inline queries.');
  
// bot.on('text', async (ctx) => {
//     const text = ctx.message.text;
//     if (text.startsWith('/')) {
//       const commandName = text.split(' ')[0].substring(1); // Get the command name without '/'
//       if (commandName.length === 0) {
//         // If no command name provided, fetch all commands from the database
//         const commandsList = await getCommandsFromDatabase();
//         const commandsText = commandsList.map((cmd) => '/' + cmd.command_name).join('\n');
//         ctx.reply(`Available commands:\n${commandsText}`);
//       } else {
//         // If a specific command name provided, handle the command
//         await handleCommand(ctx, commandName);
//       }
//     }
// });

// Create an Express router
const router = Router();

// Pass the Telegram bot as middleware
router.use(bot.webhookCallback('/secret-path'));

module.exports = router;

bot.launch();
