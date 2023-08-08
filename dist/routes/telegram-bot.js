"use strict";
const { Telegraf, Markup } = require('telegraf');
const { Client } = require('pg');
const fs = require('fs');
const { Router } = require('express'); // Add this line to import Router
const setBotCommands = require('./setBotCommands');
const token = "6223171691:AAHxCmwnExLxmcrd10do-lLtbtifwpZPcPQ";
const client = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'telegram_bot',
    password: 'root',
    port: 5432, // Default PostgreSQL port is 5432
});
// Connect to the PostgreSQL database
client.connect();
const bot = new Telegraf(token);
// Your existing command handlers
bot.command('/start', (ctx) => {
    ctx.reply('Welcome to the bot!');
});
bot.command('/help', (ctx) => {
    ctx.reply('This is the help message.');
});
bot.command('/info', (ctx) => {
    ctx.reply('This is information about the bot.');
});
// Call the setBotCommands function with the additional commands
const additionalCommands = [
    { command: 'newcommand1', description: 'Description for New Command 1' },
    { command: 'newcommand2', description: 'Description for New Command 2' },
    // Add more additional commands here
];
setBotCommands(token, additionalCommands);
async function getCommandsFromDatabase() {
    try {
        const query = 'SELECT command_name FROM commands;';
        const result = await client.query(query);
        console.log(`commands: ${JSON.stringify(result.rows)}`);
        return result.rows;
    }
    catch (error) {
        console.error('Error fetching commands:', error);
        return [];
    }
}
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
        }
        else {
            throw new Error(`Command /${commandName} does not exist.`);
        }
    }
    catch (error) {
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
            }
            else {
                ctx.reply('No commands found in the database.');
            }
        }
        catch (error) {
            ctx.reply('Error fetching commands from the database.');
        }
    }
    else {
        // If the user typed a specific command, handle it as before
        try {
            const response = await getResponseFromDatabase(commandName);
            ctx.reply(response);
        }
        catch (error) {
            ctx.reply(error.message);
        }
    }
}
// // Call the handleCommand function when a command is received
// bot.on('text', async (ctx) => {
//     const commandRegex = /^\/\w+/; // Regular expression to match commands (starts with '/')
//     console.log(`commandRegex: ${commandRegex.test(ctx.message.text)}`);
//     if (commandRegex.test(ctx.message.text)) {
//       await handleCommand(ctx);
//     }
// });
// Call the handleCommand function when a command is received
// // Handle the '/' symbol before entering the command
// bot.hears('/', async (ctx) => {
//     try {
//       console.log(`Chaitanyas`);
//       const commands = await getCommandsFromDatabase();
//       console.log(`Chaitanyas2`);
//       if (commands.length > 0) {
//         console.log(`Chaitanyas3`);
//         const commandsText = commands.join('\n');
//         ctx.reply(`Available commands:\n${commandsText}`);
//       } else {
//         ctx.reply('No commands found in the database.');
//       }
//     } catch (error) {
//       ctx.reply('Error fetching commands from the database.');
//     }
// });
// Handle inline queries
bot.on('inline_query', async (ctx) => {
    console.log(`Chaitanya4`);
    const query = ctx.inlineQuery.query; // Get the query string from the inline query
    console.log(`Chaitanya5:${JSOn.stringify(query)}`);
    // Generate results based on the query
    const results = [
        {
            type: 'article',
            id: '1',
            title: 'Result 1',
            description: 'This is the first result',
            input_message_content: {
                message_text: 'You selected Result 1',
            },
        },
        {
            type: 'article',
            id: '2',
            title: 'Result 2',
            description: 'This is the second result',
            input_message_content: {
                message_text: 'You selected Result 2',
            },
        },
    ];
    // Send the results back to the user
    await ctx.answerInlineQuery(results);
});
bot.on('text', async (ctx) => {
    const text = ctx.message.text;
    if (text.startsWith('/')) {
        const commandName = text.split(' ')[0].substring(1); // Get the command name without '/'
        if (commandName.length === 0) {
            // If no command name provided, fetch all commands from the database
            const commandsList = await getCommandsFromDatabase();
            const commandsText = commandsList.map((cmd) => '/' + cmd.command_name).join('\n');
            ctx.reply(`Available commands:\n${commandsText}`);
        }
        else {
            // If a specific command name provided, handle the command
            await handleCommand(ctx, commandName);
        }
    }
});
bot.hears('/', async (ctx) => {
    try {
        console.log(`Chaitanya1`);
        const commands = await getCommandsFromDatabase();
        if (commands.length > 0) {
            console.log(`Chaitanya2`);
            const commandButtons = commands.map((command) => Markup.button.callback(String(command), `command_${command}`));
            console.log(`Chaitanya3`);
            const inlineKeyboard = Markup.inlineKeyboard(commandButtons, { columns: 2 });
            ctx.reply('Available commands:', inlineKeyboard);
        }
        else {
            ctx.reply('No commands found in the database.');
        }
    }
    catch (error) {
        ctx.reply('Error fetching commands from the database.');
    }
});
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
    }
    else {
        ctx.reply('No commands found in the database.');
    }
});
