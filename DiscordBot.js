const twitterBot = require('./TwitterMonitor.js');
const { Client, Intents, MessageEmbed } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });
const TOKEN = 'ODcxOTI4Nzg2NzU1NjUzNjYy.YQic9g.lKe_5ZGVMmGnq4Fe44vcGX8gVNo';

client.login(TOKEN);

client.on('message', msg => {
  if(msg.content.includes('$twit') && msg.content.length == 5){

    const embed = new MessageEmbed()
        .setAuthor("$Twit Bot")
        .setTitle("$twit commands:")
        .setColor(0x0)
        .setDescription("$twit \n $twit adduser \n $twit setchannel");
        msg.channel.send({embeds : [embed]});

  }else if(msg.content.includes('$twit addkw')){

    var splitStr = msg.content.split(" ");
    var kw = splitStr[2];
    twitterBot.startKeywordStream(msg.channel, kw);
    const embed = new MessageEmbed()
        .setAuthor("$Twit Bot")
        .setTitle("Twit Bot Now Watching The Following Keywords")
        .setColor(0x0)
        .setDescription("Keyword -> " + kw);
        msg.channel.send({embeds : [embed]});

  }else if(msg.content.includes('$twit adduser')){

    var splitStr = msg.content.split(" ");
    var user = splitStr[2];
    twitterBot.startUserStream(msg.channel, user);
    const embed = new MessageEmbed()
        .setAuthor("$Twit Bot")
        .setTitle("Twit Bot Now Watching The Following Users")
        .setColor(0x0)
        .setDescription("User -> " + user);
        msg.channel.send({embeds : [embed]});

  }
})
