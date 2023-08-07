const { Telegraf } = require('telegraf');
const { Client } = require('pg');
const fs = require('fs');
const { Router } = require('express'); // Add this line to import Router

const token = "YOUR_BOT_TOKEN";

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

// async function getCommandsFromDatabase() {
//     try {
//       const query = 'SELECT * FROM commands;';
//       const result = await client.query(query);
//       console.log(`commands: ${JSON.stringify(result.rows)}`);
//       return result.rows;
//     } catch (error) {
//       console.error('Error fetching commands:', error);
//       return [];
//     }
// }

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
    try {
      const response = await getResponseFromDatabase(commandName);
      ctx.reply(response);
    } catch (error) {
      ctx.reply(error.message);
    }
}

// Call the handleCommand function when a command is received
bot.on('text', async (ctx) => {
    const commandRegex = /^\/\w+/; // Regular expression to match commands (starts with '/')
    if (commandRegex.test(ctx.message.text)) {
      await handleCommand(ctx);
    }
});
  
// const commands = await getCommandsFromDatabase();

// Start the bot
bot.launch();

// Create an Express router
const router = Router();

// Pass the Telegram bot as middleware
router.use(bot.webhookCallback('/secret-path'));

module.exports = router;


// /p command with dynamically fetched response from the database
bot.command('p', async (ctx) => {
    const commands = await getCommandsFromDatabase();
    if (commands.length > 0) {
      const response = commands[0].response; // Assuming your database table has a 'response' column
      ctx.reply(response);
    } else {
      ctx.reply('No commands found in the database.');
    }
  });
  