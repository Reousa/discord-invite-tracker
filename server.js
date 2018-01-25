const Discord = require('discord.js');
const client = new Discord.Client();
const config = require("./config.json");

client.on('ready', () => {
    console.log(`Bot has started, with ${client.users.size} users, in ${client.channels.size} channels of ${client.guilds.size} guilds.`);
    client.user.setActivity(` MoonHowl`);
});


//Lazy code, this wont be running on a production scale.
client.on('message', message => {
//Ignore bot messages.
    if(message.author.bot) return;
//Ignore message if it doesnt start with prefix
    if(message.content.indexOf(config.prefix) !== 0) return;

    console.log("Recieved message: " + message.content);

    const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    console.log(`Arguments: ${args}`);
    console.log(`Command: ${command}`);

    if(command == 'help' || command == 'h')
    {
        message.channel.send(`**Commands:**\n**!h** or **!help** - Displays the commands.\n**!ping** - Pings the server & Discord API.\n**!invites** *(optional: @ another user)* - Fetches your (or mentioned user's) count of invited users.`);
    }

    else if(command == 'invites' && message.guild.available)
    {
        var targetUser = null;
        var isAnotherUserLookup = false;
        if(message.mentions.members.first() != null)
        {
            targetUser = message.mentions.members.first().user;
            console.log(targetUser.user);
            isAnotherUserLookup = true;
        }
        else
            targetUser = message.author;

        message.guild.fetchInvites()
        .then
        (invites =>
            {
                const userInvites = invites.array().filter(o => o.inviter.id === targetUser.id);
                var userInviteCount = 0;
                    for(var i=0; i < userInvites.length; i++)
                    {
                        var invite = userInvites[i];
                        userInviteCount += invite['uses'];
                    }
                    if(isAnotherUserLookup)
                        message.channel.send(`User _${targetUser.username}_ has invited ${userInviteCount} user(s) to this server.`);
                    else
                        message.reply(`You have invited ${userInviteCount} user(s) to this server. Keep up the good work!`);
            }
        )
        .catch(console.error);
    }

    else if (command == 'ping')
    {
        message.channel.send("Ping you say?")
        .then(m => message.channel.send(`Well, pong!\nLatency is ${m.createdTimestamp - message.createdTimestamp}ms. \nAPI Latency is ${Math.round(client.ping)}ms. Have a good day sir!`))
        .catch(console.error);

    }
});
//DO NOT SHARE THIS TOKEN PUBLICLY!!
//Replace this code with your token.
if(process.env.TOKEN_VAR != null)
    var token = process.env.TOKEN_VAR;
else
    var token = 'NDA2MjEyMjIwNTkxMDEzODg4.DUvqIg.Ro17OuXqVFbl1aP_zy4KmaOq5Pw';

client.login(token);
