const twitterBot = require('./TwitterMonitor.js');
const { Client, Intents, MessageEmbed } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });
const TOKEN = 'ODcxOTI4Nzg2NzU1NjUzNjYy.YQic9g.lKe_5ZGVMmGnq4Fe44vcGX8gVNo';

client.login(TOKEN);

client.on('message', async (msg) => {
  if(msg.content.includes('$twit') && msg.content.length == 5){

    const embed = new MessageEmbed()
        .setAuthor("$Twit Bot")
        .setTitle("$twit commands:")
        .setColor(0x0)
        .setDescription("$twit \n $twit adduser USER \n $twit addkw KEYWORD \n $twit start");
        msg.channel.send({embeds : [embed]});

  }else if(msg.content.includes('$twit adduser')){

    var rules = msg.content.split(" ");
    await twitterBot.addInUser(rules[2]);
    const embed = new MessageEmbed()
        .setAuthor("$Twit Bot")
        .setTitle("Rules Added")
        .setColor(0x0)
        .setDescription("New User Rule -> " + rules[2]);
        msg.channel.send({embeds : [embed]});

  }else if(msg.content.includes('$twit addkw')){
    var rules = msg.content.split(" ");
    await twitterBot.addInRules(rules[2]);
    const embed = new MessageEmbed()
        .setAuthor("$Twit Bot")
        .setTitle("Rules Added")
        .setColor(0x0)
        .setDescription("New KW Rule -> " + rules[2]);
        msg.channel.send({embeds : [embed]});
  }else if(msg.content.includes('$twit start')){

    await twitterBot.start(msg.channel);
    const embed = new MessageEmbed()
        .setAuthor("$Twit Bot")
        .setTitle("Bot Started")
        .setColor(0x0)
        .setDescription("Twit bot is now running");
        msg.channel.send({embeds : [embed]});
  }
})
