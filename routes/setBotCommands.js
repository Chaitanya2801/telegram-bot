// import https from "https"
const {https} = require("https");
var request = require('request');
// const { fetch }= require("node-fetch"); 

async function setBotCommands(botToken, commands) {
  const url = `https://api.telegram.org/bot${botToken}/setMyCommands?commands=${JSON.stringify(commands)}`;
  const requestOptions = {
    method: 'POST',
    url: url,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      commands: commands,
    }),
  };

  try {
    const response = await request(url, requestOptions);
    const data = await response.json();
    console.log('Commands set successfully:', JSON.stringify(data));
  } catch (error) {
    console.error('Error setting commands:', error);
  }
}

module.exports = setBotCommands;
