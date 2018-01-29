const Discord = require('discord.js');
const client = new Discord.Client();
const config = require("./config.json");

var EpicVikingServerConfig = require("./EpicVikingServer.config.json");

client.on('ready', () => {
    console.log(`Bot has started, with ${client.users.size} users, in ${client.channels.size} channels of ${client.guilds.size} guilds.`);
    client.user.setActivity(` MoonHowl`);
});


//Lazy code, this wont be running on a production scale and im really bad with javascript.
client.on('message', message => {
//Ignore bot messages.
    if(message.author.bot) return;
//Ignore message if it doesnt start with prefix
    if(message.content.indexOf(config.prefix) !== 0) return;

    if(message.guild.id == EpicVikingServerConfig.Id)
        EpicVikingServerHandle(message);
    else
        NormalHandle(message);
});

function NormalHandle(message)
{
    console.log("Recieved message: " + message.content);

    const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    console.log(`Arguments: ${args}`);
    console.log(`Command: ${command}`);

    if( (command == 'help' || command == 'h') && message.guild.available)
    {
        message.channel.send(`**Commands:**\n**!!h** or **!!help** - Displays the commands.\n**!!ping** - Pings the server & Discord API.\n**!!invites** *(optional: @ another user)* - Fetches your (or mentioned user's) count of invited users.\n`
                            +'**!!mylinks** - *(optional: @ another user)* - Fetches your invite links & whether they are permenant.');
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

    else if(command == 'mylinks' && message.guild.available)
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
                var userInviteLinksStr = '';
                    for(var i=0; i < userInvites.length; i++)
                    {
                        var invite = userInvites[i];
                        userInviteLinksStr += `Link: *discord.gg/${invite['code']}* - Permenant: *${!invite['temporary']}*\n`;
                    }
                    if(isAnotherUserLookup)
                        message.channel.send(`User _${targetUser.username}_'s invite links are \n${userInviteLinksStr}.`);
                    else
                        message.reply(`Your invite links are \n${userInviteLinksStr} \nEnjoy!`);
            }
        )
        .catch(console.error);
    }

    else if (command == 'ping' && message.guild.available)
    {
        message.channel.send("Ping you say?")
        .then(m => message.channel.send(`Well, pong!\nLatency is ${m.createdTimestamp - message.createdTimestamp}ms. \nAPI Latency is ${Math.round(client.ping)}ms. Have a good day sir!`))
        .catch(console.error);

    }
}


function EpicVikingServerHandle(message)
{
    //Minimum invites to have that specific role.


    console.log("Recieved message: " + message.content);

    const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    console.log(`Arguments: ${args}`);
    console.log(`Command: ${command}`);

    if( (command == 'help' || command == 'h') && message.guild.available)
    {
        message.channel.send(`**Commands:**\n**!!h** or **!!help** - Displays the commands.\n**!!ping** - Pings the server & Discord API.\n**!!invites** *(optional: @ another user)* - Fetches your (or mentioned user's) count of invited users.\n`
                            +'**!!mylinks** - *(optional: @ another user)* - Fetches your invite links & whether they are permenant.\nYou will be promoted based on your invite count automatically after using **!!invites**');
    }

    else if(command == 'invites' && message.guild.available)
    {
        var targetUser = null;
        var isAnotherUserLookup = false;
        if(message.mentions.members.first() != null)
        {
            targetUser = message.mentions.members.first();
            isAnotherUserLookup = true;
        }
        else
            targetUser = message.member;

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
                var HighestRoleName = "";
                var HighestRoleCounter = 0;
                    for(var i=0; i < EpicVikingServerConfig.MinimumInviteCountRoles.length; i++)
                    {
                        var RoleName = EpicVikingServerConfig.MinimumInviteCountRoles[i]["Name"]
                            if (userInviteCount >= EpicVikingServerConfig.MinimumInviteCountRoles[i]["Value"])
                            {
                                HighestRoleName = RoleName;
                                HighestRoleCounter = i;
                                //Outputs a console error for soem reason.
                                targetUser.addRole(message.guild.roles.find("name", RoleName));
                            }
                    }

                    if(HighestRoleCounter+1 >= EpicVikingServerConfig.MinimumInviteCountRoles.length)
                        var requires = `have maximum rank.`;
                    else
                        var requires = `highest owned rank is: <@&${EpicVikingServerConfig.MinimumInviteCountRoles[HighestRoleCounter]["Id"]}>`
                        +`\nrequires ${EpicVikingServerConfig.MinimumInviteCountRoles[HighestRoleCounter+1]["Value"]-userInviteCount} invites to be promoted to  <@&${EpicVikingServerConfig.MinimumInviteCountRoles[HighestRoleCounter+1]["Id"]}>.`;
                    if(isAnotherUserLookup)
                        message.channel.send(`User _${targetUser.user.username}_ has invited ${userInviteCount} user(s) to this server.`
                                            +`\nTheir ${requires}`);
                    else
                        message.reply(`You have invited ${userInviteCount} user(s) to this server. Keep up the good work!`
                                    +`\nYour ${requires}`);
            }
        )
        .catch(console.error);
    }

    else if(command == 'mylinks' && message.guild.available)
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
                var userInviteLinksStr = '';
                    for(var i=0; i < userInvites.length; i++)
                    {
                        var invite = userInvites[i];
                        userInviteLinksStr += `Link: *discord.gg/${invite['code']}* - Permenant: *${!invite['temporary']}*`;
                    }
                    if(isAnotherUserLookup)
                        message.channel.send(`User _${targetUser.username}_'s invite links are \n${userInviteLinksStr}.`);
                    else
                        message.reply(`Your invite links are \n${userInviteLinksStr} \nEnjoy!`);
            }
        )
        .catch(console.error);
    }

    else if (command == 'ping' && message.guild.available)
    {
        message.channel.send("Ping you say?")
        .then(m => message.channel.send(`Well, pong!\nLatency is ${m.createdTimestamp - message.createdTimestamp}ms. \nAPI Latency is ${Math.round(client.ping)}ms. Have a good day sir!`))
        .catch(console.error);

    }
}


//DO NOT SHARE THIS TOKEN PUBLICLY!!
//Replace this code with your token.
if(process.env.TOKEN_VAR != null)
    var token = process.env.TOKEN_VAR;
else
    var token = 'Your-token';

client.login(token);
