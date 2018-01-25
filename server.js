const Discord = require('discord.js');
const client = new Discord.Client();
const config = require("./config.json");


client.on('ready', () => {
  console.log('I am ready!');
});

client.on('message', message => {
//Ignore bot messages.
    if(message.author.bot) return;
//Ignore message if it doesnt start with prefix
    if(message.content.indexOf(config.prefix) !== 0) return;

    console.log("Recieved message: " + message.content);

    const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    console.log("Arguments:" + args);
    console.log("Command:" + command);

  if (message.content === 'ping') {
    // message.reply('pong');
  }
});

//DO NOT SHARE THIS TOKEN PUBLICLY!!
//Replace this code with your token.
var token = process.env.TOKEN_VAR;
client.login(token);
