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

const commandScope = {type: "all_group_chats"}; //, chat_id: '-634301736' DappLokkerWolrd3

let additionalCommands = [
    {command: 'price', description: 'Description for New Command 4'},
];
// setBotCommands(token, additionalCommands, commandScope);
bot.telegram.setMyCommands(additionalCommands, {scope: commandScope});

additionalCommands = [
    {command: 'tvl', description: 'Description for New Command 4'},
    {command: 'gasprices', description: 'Description for New Command 4'},
];
bot.telegram.setMyCommands(additionalCommands);

console.log(`additionalCommands: ${JSON.stringify(additionalCommands)}`);
console.log(`additionalCommands: ${JSON.stringify(additionalCommands)}`);

additionalCommands = [
  {command: 'charts', description: 'Description for New Command 9'},
];

bot.telegram.setMyCommands(additionalCommands, {scope: commandScope});

console.log(`additionalCommands: ${JSON.stringify(additionalCommands)}`);
// setBotCommands(token, additionalCommands, commandScope);

bot.command('start', async (ctx) => {
    const chatId = ctx.chat.id;
    console.log(`chatId: ${chatId}`);
    ctx.reply('More power to you.');
});

async function getResponseFromDatabase(commandName) {
    try {
      const query = 'SELECT response_template FROM commands WHERE command_name = $1;';
      const values = [commandName];
      const result = await client.query(query, values);
      console.log(`query:${JSON.stringify(query)}`);
      console.log(`values:${JSON.stringify(values)}`);
      console.log(`result:${JSON.stringify(result)}`);
      if (result.rows.length > 0) {
        return result.rows[0].response_template;
      } else {
        throw new Error(`Command /${commandName} does not exist.`);
      }
    } catch (error) {
      throw new Error('Error fetching response from database:', error);
    }
}

async function handleCommand(ctx) {
    const commandName = ctx.message.text.split(' ')[0].substring(1);
    console.log(`commandName: ${commandName}`); // Get the command name without '/'
  
    if (commandName === '') {
      // If the user typed "/", show a list of available commands
      try {
        const commands = await getCommandsFromDatabase();
        if (commands.length > 0) {
          const commandList = commands.map((command) => `/${command.command_name}`).join('\n');
          ctx.reply(`Available commands:\n${commandList}`);
        } else {
          ctx.reply('No commands found in the database.');
        }
      } catch (error) {
        ctx.reply('Error fetching commands from the database.');
      }
    } else {
      // If the user typed a specific command, handle it as before
      try {
        const response = await getResponseFromDatabase(commandName);
        ctx.reply(response);
      } catch (error) {
        ctx.reply(error.message);
      }
    }
}

// Call the handleCommand function when a command is received
bot.on('text', async (ctx) => {
    const commandRegex = /^\/\w+/; // Regular expression to match commands (starts with '/')
    console.log(`commandRegex: ${commandRegex.test(ctx.message.text)}`);
    if (commandRegex.test(ctx.message.text)) {
      await handleCommand(ctx);
    }
});

// bot.command('help', async (ctx) => {
//   const params = ctx.message.text.split(' ').slice(1).join(' '); // Extract and join the parameters
//   const replyMessage = `More power to you!!!!!. Parameters: ${params}`;
//   ctx.reply(replyMessage);
// });

// Create an Express router
const router = Router();

// Pass the Telegram bot as middleware
router.use(bot.webhookCallback('/secret-path'));

module.exports = router;

bot.launch();
