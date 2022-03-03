require('dotenv').config();
const {MessageEmbed} = require('discord.js');
const Twitter = require('twitter');
const client = new Twitter({
   'dKGQjCDJIO13j1pAN8ZOa1Jx3',
   'KQmZMz3Ke38oZuOxRahVjUPTDeUvBo0GLwArTztwrCQ0BN0F9m',
   '4438948518-qtbDV4mHfvrG9Gnvhkc8BPgQRtwHiMzmxaHAusN',
   '1tu9FWgpYGO4xZnVksINK5DVkQwPNfqGlearsGfvS78Rl'
});

module.exports.startKeywordStream = function (channel, kw){
  const stream = client.stream('statuses/filter', {track: kw, tweet_mode: 'extended', language: 'en'});
  stream.on('data', (data) => {
     if (!data.retweeted_status) {
        const tweetText = data?.extended_tweet?.full_text || data.text;
        console.log(tweetText);
        const embed = new MessageEmbed()
            .setAuthor("$Twit Bot")
            .setTitle("New Tweet")
            .setColor(0x0)
            .setDescription(tweetText);
        channel.send({embeds : [embed]});
     }
  });

  stream.on('error', (error) => {
     throw error;
  });
}

module.exports.startUserStream = function (channel, user){
  const stream = client.stream('statuses/filter', {follow: user, tweet_mode: 'extended', language: 'en'});
  stream.on('data', (data) => {
    console.log(data.text);
     if (!data.retweeted_status && data.user.id_str == user) {
        const tweetText = data?.extended_tweet?.full_text || data.text;
        console.log(tweetText);
        const embed = new MessageEmbed()
            .setAuthor("$Twit Bot")
            .setTitle("New Tweet from @" + user)
            .setColor(0x0)
            .setDescription(tweetText);
        channel.send({embeds : [embed]});
     }
  });

  stream.on('error', (error) => {
     throw error;
  });
}
