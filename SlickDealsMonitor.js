const { MessageEmbed } = require('discord.js');
const axios = require('axios');
const cheerio = require('cheerio');
const request = require('request');

const sdLink = 'https://slickdeals.net/forums/filtered/?daysprune=1&vote=0&f=9&sort=threadstarted&order=desc&r=1&perpage=80';

const deals = [];

async function sendToWebhook(msg){
  var embed = {
    author: {
      name: "Twitter Bot for Discord - V0.0.1 - Dev"
    },
    title: `New Deal`,
    description: msg
  }
  var options = { method: 'POST',
    url: 'https://discord.com/api/webhooks/1002707656965894144/yGK4JA-4Zda8pwumhj7iv5XIBgLdIKiE3u4QfeoFi7DvOwZvv4l2FVcoZVpCbk9c7yHa',
    headers:
     { 'cache-control': 'no-cache',
       'content-type': 'application/json' },
    body: { embeds:[embed] },
    json: true };

  request(options, function (error, response, body) {
    console.log(body);
  });
}

function scrapeHtml(link){
  axios.get(link).then((res) => {
    parsePosts(res.data);
  });
}

function newDeal(dealTitle){
  var contains = true;
  deals.forEach((item, i) => {
    if(item == dealTitle){
      contains = false;
    }
  });
  return contains;
}

function parsePosts(html){
  const $ = cheerio.load(html);
  $('.bp-p-dealLink').each((index, element) => {
    if($(element).text() != '1' && $(element).text() != 'Last Page' && $(element).text() != ''){
      if(newDeal($(element).text())){
        console.log($(element).text());
        deals.push($(element).text());
        sendToWebhook($(element).text());
      }
    }
  });
}

function start(){
  const interval = setInterval(function() {
    console.log('checked');
    scrapeHtml(sdLink);
  }, 5000);
}

start();
