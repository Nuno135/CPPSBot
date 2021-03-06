const Discord = require("discord.js");
const bot = new Discord.Client()
const embed = new Discord.RichEmbed();
const prefix = "!";
const Cleverbot = require('cleverbot-node');
const cleverbot = new Cleverbot;
const isDev = ['ID1', 'ID2']; 
const isStaff = ['ID1', 'ID2', 'ID3'];
const thestats = require('./status.json');
const fs = require('fs');
const d20 = require("d20");
const search = require("youtube-search");
const opts = {
  maxResults: 1,
  key: 'api-key'
};

bot.on('ready', function () {

	console.log('Bot Online and Ready! On ' + bot.guilds.size + ' Servers!');
	bot.user.setStatus('online', '!help | !invite');
});



//HELLO MSG
bot.on("guildMemberAdd", (guild, member) => {
guild.defaultChannel.send(`${member.user.username} joined ${guild.name}`);
var mb = guild.roles.find("name", "member");
member.addRole(mb)
guild.defaultChannel.send(`${member.user.username} has been automaticly promoted to member`);
});

//BYE MSG
bot.on("guildMemberRemove", (guild, member) => {
guild.defaultChannel.send(`${member.user.username} left ${guild.name}`);
});

//SET STATUS
bot.on("guildCreate", (guild) => {
thestats[guild.id] = {
			name: guild.name,
			id: guild.id,
                        status: "undefined"
					};
					fs.writeFile('status.json', JSON.stringify(thestats, null, 4), 'utf8', function (err) {
						if (err) return;
						guild.defaultChannel.send(`The CPPS's status is not set yet! Please set it using "!cppson", !cppsoff", or !cppsindev!`);
					});
});
bot.on("message" ,msg => {
const suffix = msg.content.split(" ").slice(1).join(" ");

    //USERS
    if (msg.content === prefix + "users") {
        var filusers = msg.guild.memberCount;
        msg.channel.send(`There are ${filusers} users in this server.`)
    }
    //CPPSON
    if (msg.content.startsWith(prefix + "cpps ")) {
        if (msg.author.id === msg.guild.owner.user.id || isStaff.indexOf(msg.author.id) > -1) {
            if (suffix !== "on" && suffix !== "off" && suffix !== "indev")
                return msg.channel.send("Invalid function!");
            if (suffix === "on") {
        thestats[msg.guild.id] = {
			name: msg.guild.name,
			id: msg.guild.id,
                        status: "online"
					};
					fs.writeFile('status.json', JSON.stringify(thestats, null, 4), 'utf8', function (err) {
						if (err) return;
						msg.channel.send(`Done! ${msg.guild.name}'s status is now online!`);
					});
            } else
                if (suffix === "off") {
                    thestats[msg.guild.id] = {
			name: msg.guild.name,
			id: msg.guild.id,
                        status: "offline"
					};
					fs.writeFile('status.json', JSON.stringify(thestats, null, 4), 'utf8', function (err) {
						if (err) return;
						msg.channel.send(`Done! ${msg.guild.name}'s status is now offline!`);
					});
            } else
                 if (suffix === "indev") {
                thestats[msg.guild.id] = {
			name: msg.guild.name,
			id: msg.guild.id,
                        status: "in development"
					};
					fs.writeFile('status.json', JSON.stringify(thestats, null, 4), 'utf8', function (err) {
						if (err) return;
						msg.channel.send(`Done! ${msg.guild.name}'s status is now in development!`);
					});
            }
        } else {
            msg.channel.end("Invalid permissions! Only the server owner can do this!")
        }
    }

    //CPPSSTATS
    if (msg.content === prefix + "cppsstats") {
        var stats = thestats[msg.guild.id].status;
        if (stats === "undefined") {
            msg.channel.send(`The CPPS's status is not set yet! Please set it using "!cppson", !cppsoff", or !cppsindev!`)
        } else {
        msg.channel.send(`${msg.guild.name} is ${stats}!`)
        }
    }
//COMMANDS
   if (msg.content === prefix + "help" || (msg.isMentioned(bot.user))) {
       msg.author.send([
           "Hello, I am " + bot.user.username + ". I was created by **Dev321** and **Nuno**. My current commands are: " +
           "\n**setname**: Sets my username." +
           "\n**say**: Sends a message that you wrote." +
           "\n**cppson**: Sets the CPPS status online." +
           "\n**cppsoff**: Sets the CPPS status offline." +
           "\n**cppsindev**: Sets the CPPS status in development." +
           "\n**setname**: Sets a bot nickname." +
           "\n**ping**: Returns Pong." +
           "\n**idle**: Sets bot status idle." +
           "\n**online**: Sets bot status online." +
           "\n**clever**: Talk with the bot." +
           "\n**rolemembers**: Lists the members in a role." +
           "\n**8ball**: Ask 8ball a question." +
           "\n**stats**: Shows bot stats." +
           "\n**gn**: Sets server name." +
           "\n**myperm**: Sends user perms." +
           "\n**create**: Creates channel." +
           "\n**delete**: Deletes channel." +
           "\n**topic**: Sets channel topic." +
           "\n**uptime**: Shows bot uptime." +
           "\n**invite**: Invite the bot to your server." +
           "\n**makerole**: Creates a role." +
	   "\n**wiki**: Search anything using wiki." +
	   "\n**logservers**: See how many servers do you have in your logchannel." +
	   "\n**pfp**: See someones profile picture." +
	   "\n**id**: See someones id" +
	   "\n**match**: See your love metre." +
	   "\n**clone**: Make the bot clone someone." +
	   "\n**wiki**: Search anything using wiki." +
	   "\n**create**: Create a channel." +
	   "\n**delete**: Delete a channel." +
	   "\n**topic**: Set a topic for your channel." +
	   "\nMore commands are being added!" +
	   "\n**youtube**: Searches your favourite video." +
	   "\n**roll**: Roll your lucky number." +
	   "\n**userinfo**: Gives user information."
                               ])
   }
 //NICKNAME
    if (msg.content.startsWith(prefix + 'setname')) {
         let args = msg.content.split(' ').slice(1).join(" ");
                    msg.guild.member(bot.user).setNickname(args).then(() => {
                        msg.channel.send("Success!")
                    });
        }



    //PING
    if (msg.content.startsWith(prefix + "ping")) {
        msg.channel.send("Ping?")
            .then(message => {
        message.edit(`Pong! (took: ${message.timestamp - msg.timestamp}ms)`);
    });
}
   //IDLE
    if (msg.content.startsWith(prefix + "idle")) {
    bot.user.setStatus("idle").then(() => {
        msg.channel.send("Your bot is idle now.")
    });
}
    //ONLINE
    if (msg.content.startsWith(prefix + "online")) {
        bot.user.setStatus("online").then(() => {
            msg.channel.send("Your bot is online now.")
        });
    }
    //CLEVERBOT
    if (msg.content.startsWith(prefix + 'clever')) {
        try {
			var cleverMessage = msg.content.split(' ').splice(1).join(' ');
			Cleverbot.prepare(function () {
				cleverbot.write(cleverMessage, function (response) {
					msg.channel.send(response.message);
				});
			});
        } catch (err) {
            console.log(err)
        }
	}

	//SAY
	 if (msg.content.startsWith(prefix + "say")) {
            let args = msg.content.split(' ').slice(1).join(" ");
                msg.channel.send(args)
    }

	//BAN
if (msg.content.startsWith(prefix + "ban")) {
    if (isStaff.indexOf(msg.author.id) > -1) {
        var usern = msg.mentions.users.first();
		var days = suffix[1];
    if (days.length > 7) {
        msg.channel.send("You can only delete up to 7 days of messages!")
    }
if (!usern) {
    msg.channel.send("Error.")
}
    msg.channel.send("Successfully banned **" + usern.username + usern.discriminator + "**").then (() => {
		msg.guild.ban(usern, days)
    });
    }
	}
//MEMBERS IN ROLE
    if (msg.content.startsWith(prefix + 'rolemembers')) {
	   try {
	 let roleName = msg.content.split(' ').splice(1).join(' ');
	 let roleID = msg.guild.roles.find('name', roleName);
	 let membersWithRole = msg.guild.members.filter(m => m.roles.has(roleID.id));
	 let listOfMembers = membersWithRole.array().map(m => m.user.username).join(', ');
	 msg.channel.send(`*${listOfMembers}*`);
	 } catch (err) {
	   console.log(err)
	 }
	 }


//UPTIME
if (msg.content === prefix + "uptime") {
var date = new Date(bot.uptime);
            var strDate = '**';
            strDate += date.getUTCDate() - 1 + ' days, ';
            strDate += date.getUTCHours() + ' hours, ';
            strDate += date.getUTCMinutes() + ' minutes, ';
            strDate += date.getUTCSeconds() + ' seconds**';
msg.channel.send(strDate)
}

//8BALL
if (msg.content.startsWith(prefix + "8ball")) {
var ball = ['Yes', 'No'];
msg.channel.send(ball[~~(Math.random() * ball.length)])
}
 //STATS
 if (msg.content === prefix + "stats") {
      let m = '';
      m += `I am aware of ${msg.guild.channels.size} channels\n`;
      m += `I am aware of ${msg.guild.members.size} members\n`;
      m += `I am aware of ${bot.channels.size} channels overall\n`;
      m += `I am aware of ${bot.guilds.size} guilds overall\n`;
      m += `I am aware of ${bot.users.size} users overall\n`;
      msg.channel.send(m)
    }
	//SET GUILD NAME
    if (msg.content.startsWith(prefix + 'gn')) {
      msg.guild.setName(msg.content.substr(3))
       .then(() => {
      msg.channel.send('Guild name updated');
       }).catch(console.log);
}
//SEND USER PERMS
 if (msg.content === prefix + "myperm") {
      msg.channel.send('Your permissions are:\n' +
        JSON.stringify(msg.channel.permissionsFor(msg.author).serialize(), null, 4));
}
//CREATE ROLE
if (msg.content.startsWith(prefix + "makerole")) {
    var toname = msg.content.split(" ").slice(1).join(" ");
      msg.guild.createRole({name: toname}).then(role => {
        msg.channel.send(`Made role ${role.name}`);
      }).catch(console.log);
}
//KICK
if (msg.content.startsWith(prefix + "kick")) {
    var tokick = msg.mentions.users.first();
    if (tokick.id !== "172711836557377536") {
      msg.guild.member(tokick).kick().then(member => {
        console.log(member);
        msg.channel.send('Kicked!' + member.user.username);
      }).catch(console.log);
    } else {
        msg.channel.send("Error, you can't kick the bot owner!")
    }
}

if (msg.content.startsWith(prefix + "invite")) {
msg.channel.send([
           "Hello, I am " + bot.user.username + ". To invite me to your server please click this link. " +
           "https://discordapp.com/oauth2/authorize?&client_id=BOT_ID&scope=bot&permissions=8"
])
}
    //ID
    if (msg.content.startsWith(prefix + "id")) {
        try {
        var toid = msg.mentions.users.first();
        msg.channel.send(toid.id)
        } catch (err) {
            console.log(err)
        }
    }

    //GIF
    if (msg.content.startsWith(prefix + "gif")) {
            var tags = suffix;
			if (typeof id !== "undefined") {
			    msg.channel.send( "http://media.giphy.com/media/" + id + "/giphy.gif [Tags: " + (tags ? tags : "Random GIF") + "]");
			}
			else {
			    msg.channel.send( "Invalid tags, try something different. [Tags: " + (tags ? tags : "Random GIF") + "]");
			}
}
    //CREATE CHANNEL
    if (msg.content.startsWith(prefix + "create")) {
        try {
        var ctoc = suffix;
        msg.guild.createChannel(ctoc, 'text').then(() => {
           msg.channel.send("Successfully created a channel called: `" + ctoc + "`")
        });

    } catch (err) {
        msg.channel.send("An error occured!")
    }
    }

	//DELETE CHANNEL
	if (msg.content.startsWith(prefix + "delete")) {
		 var channel = bot.channels.find("id",suffix);
			if(suffix.startsWith('<#')){
				channel = bot.channels.find("id",suffix.substr(2,suffix.length-3));
			}
            if(!channel){
				var channels = msg.channel.guild.channels.findAll("name",suffix);
				if(channels.length > 1){
					var response = "Multiple channels match, please use id:";
					for(var i=0;i<channels.length;i++){
						response += channels[i] + ": " + channels[i].id;
					}
					msg.channel.send(response);
					return;
				}else if(channels.length == 1){
					channel = channels[0];
				} else {
					msg.channel.send( "Couldn't find channel to delete!");
					return;
				}
			}
            msg.channel.guild.defaultChannel.send("deleting channel " + suffix + " at " +msg.author + "'s request");
            if(msg.channel.guild.defaultChannel != msg.channel){
                msg.channel.send("deleting " + channel);
            }
            channel.delete().then(function(channel){
				console.log("deleted " + suffix + " at " + msg.author + "'s request");
            }).catch(function(error){
				msg.channel.send("couldn't delete channel: " + error);
			});
}
//SETTOPIC
if (msg.content.startsWith(prefix + "topic")) {
 var coc = suffix;
msg.channel.setTopic(coc);
msg.channel.send('Topic created');
}
    //END
    if (msg.content === prefix + "end") {
        if (isStaff.indexOf(msg.author.id) > -1) {
        msg.channel.send("Shutting down...").then(() => {
        bot.destroy()
        });
        } else {
            msg.channel.send("Invalid Permission!")
        }
    }
    //LOVECALC
    if (msg.content.startsWith(prefix + "match")) {
        var ou = msg.mentions.users.first();
        var rolle = Math.floor((Math.random() * 100) + 1);
			if (isNaN(rolle)) {
				logMsg(Date.now(), 'WARN', msg.channel.server.id, msg.channel.id, msg.author.username + ' provided nonsensical love parameter');
				msg.channel.send(' Wut.');
			} else {
				msg.channel.send(`**${msg.author.username}** & **${ou.username}** || Match: ${parseInt(rolle)}%`);
			}
    }
    //LOGO
    if (msg.content.startsWith(prefix + "pfp")) {
        var userpfp = msg.mentions.users.first();
        if (!userpfp) {
        msg.channel.send(bot.user.avatarURL)
        } else {
            msg.channel.send(userpfp.avatarURL)
        }
    }
//LOGSERVERS
    if (msg.content === prefix + "logservers") {
        if (isStaff.indexOf(msg.author.id) > -1) {
        bot.channels.get('237996502742466561').send(bot.guilds.array().map(g => g.name + "[" + g.id + "]").join(", "))
        }
    }
//MEME
if (msg.content === prefix + "randommeme") {
var links = ([
           "http://images-cdn.9gag.com/photo/azjbwrb_460s.jpg",
           "https://lh3.googleusercontent.com/txMDoD--7uZzZqBnh92Ngez4CNmpQClqY4KddcNc7OcF0t9Xk5CWQy5InzseMhXycg=h900",
		   "https://s-media-cache-ak0.pinimg.com/236x/01/0b/68/010b68214bf1eeb91060732aa58bed1e.jpg",
		   "http://s.quickmeme.com/img/c9/c9c9573e46b3fb7bd6003c62958f4e9bbe9b305801c1e14dff0ab955172c0f74.jpg",
		   "https://s-media-cache-ak0.pinimg.com/736x/68/8d/37/688d37bc8fce8727923ca7c60beba8ec.jpg",
		   "http://www.newslinq.com/wp-content/uploads/2014/06/ex-girlfriend-meme-14.jpg",
		   "https://cdn.pastemagazine.com/www/system/images/photo_albums/trump-memes/large/1fe.png?1384968217",
		   "https://www.surf.co/images/y-tho.jpg?image=cdn",
		   "https://pbs.twimg.com/profile_images/735571268641001472/kM_lPhzP.jpg"
])
var item = links[~~(Math.random() * links.length)];
msg.channel.sendFile(item)
}
//WIKI
 if (msg.content.startsWith(prefix + "wiki")) {
		  var query = suffix;
            if(!query) {
                msg.channel.send("usage: " + Config.commandPrefix + "wiki search terms");
                return;
            }
            const wiki = require('wikijs').default;
            wiki().search(query,1).then(function(data) {
                wiki().page(data.results[0]).then(function(page) {
                    page.summary().then(function(summary) {
                        var sumText = summary.toString().split('\n');
                        var continuation = function() {
                            var paragraph = sumText.shift();
                            if(paragraph){
                                msg.channel.send(paragraph,continuation);
                            }
                        };
                        continuation();
                    });
                });
            },function(err){
                msg.channel.send(err);
            });
}
//YOUTUBE SEARCH
 if (msg.content.startsWith(prefix + "youtube")) {
   search(suffix, opts, function(err, results) {
   if(err) return console.log(err);
   msg.channel.send(results[0].link)
   console.dir(`YOUTUBE: Searched for: ${suffix[1]}, ${results[0].link}, ${results[0].title}`);
 });
}
//ROLL
if (msg.content.startsWith(prefix + "roll")) {
 if (suffix.split("d").length <= 1) {
                msg.channel.send(msg.author + " rolled a " + d20.roll(suffix || "10"));
            }
            else if (suffix.split("d").length > 1) {
                var eachDie = suffix.split("+");
                var passing = 0;
                for (var i = 0; i < eachDie.length; i++){
                    if (eachDie[i].split("d")[0] < 50) {
                        passing += 1;
                    };
                }
                if (passing == eachDie.length) {
                    msg.channel.send(msg.author + " rolled a " + d20.roll(suffix));
                }  else {
                    msg.channel.send(msg.author + " tried to roll too many dice at once!");
                }
            }
        }
	//ANNOUNCE
if (msg.content.startsWith(prefix + "announce")) {
if (msg.author.id === msg.guild.owner.user.id) {
msg.channel.send(suffix,{tts:true});
 } else {
msg.channel.send("Invalid permissions! Only the server owner can do this!")
}
}
	//USERINFO
    if (msg.content.startsWith(prefix + "userinfo")) {
        var ui = msg.mentions.users.first();
        if (!ui) {
msg.channel.send([
    "Username: " + msg.author.id + "#" + msg.author.discriminator +
    "\nID: " + msg.author.id +
    "\nBot?: " + msg.author.bot
])
        } else {
            msg.channel.send([
            "Username: " + ui.username + "#" + ui.discriminator +
                "\nID: " + ui.id +
                "\nBot?: " + ui.bot
                ])
        }
    }
});



bot.login("token");
