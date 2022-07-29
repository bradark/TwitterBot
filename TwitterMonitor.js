const { MessageEmbed } = require('discord.js');
const needle = require('needle');
const fetch = require('fetch');
const request = require('request');
const token = 'AAAAAAAAAAAAAAAAAAAAAGn3ZQEAAAAA3b6CczedULxhlMuA0bpFG9WtY3I%3Dej6zZZNxEQNIxd5TuwEqxZ1ZzvQPV4sf7YF6NSmbQPnJGyM149';
const rulesURL = 'https://api.twitter.com/2/tweets/search/stream/rules';
const streamURL = 'https://api.twitter.com/2/tweets/search/stream';

const rules = [
  {'value': 'from:nicedrops', 'tag': 'drops'},
  {'value': 'from:firstsquawk', 'tag': 'news'},
  {'value': 'from:Dabradlee', 'tag': 'test'},
];

async function getAllRules() {
    const response = await needle('get', rulesURL, {
        headers: {
            "authorization": `Bearer ${token}`
        }
    })
    if (response.statusCode !== 200) {
        throw new Error(response.body);
    }
    return (response.body);
}

async function deleteAllRules(rules) {
    if (!Array.isArray(rules.data)) {
        return null;
    }
    const ids = rules.data.map(rule => rule.id);
    const data = {
        "delete": {
            "ids": ids
        }
    }
    const response = await needle('post', rulesURL, data, {
        headers: {
            "content-type": "application/json",
            "authorization": `Bearer ${token}`
        }
    })
    if (response.statusCode !== 200) {
        throw new Error(response.body);
    }
    return (response.body);
}

async function setRules() {
    const data = {
        "add": rules
    }
    const response = await needle('post', rulesURL, data, {
        headers: {
            "content-type": "application/json",
            "authorization": `Bearer ${token}`
        }
    })
    if (response.statusCode !== 201) {
        throw new Error(response.body);
    }
    return (response.body);
}

function streamConnect(channel) {
    const stream = needle.get(streamURL, {
        headers: {
            "User-Agent": "v2FilterStreamJS",
            "Authorization": `Bearer ${token}`
        },
        timeout: 20000
    });
    stream.on('data', data => {
        try {
            const json = JSON.parse(data);
            console.log(json.data);
            //console.log(json.data.matching_rules[0]);
            //console.log(json.data.matching_rules[0].tag);
            sendToWebhook(json.data.text);
        } catch (e) {
            // Keep alive signal received. Do nothing.
        }
    }).on('error', error => {
        if (error.code === 'ETIMEDOUT') {
            stream.emit('timeout');
        }
    });
    return stream;
}

async function start(channel) {
    let currentRules;
    try {
        currentRules = await getAllRules();
        await deleteAllRules(currentRules);
        await setRules();
    } catch (e) {
        console.error(e);
        process.exit(-1);
    }
    const filteredStream = streamConnect();
    let timeout = 0;
    filteredStream.on('timeout', () => {
        // Reconnect on error
        console.warn('A connection error occurred. Reconnecting…');
        setTimeout(() => {
            timeout++;
            streamConnect();
        }, 2 ** timeout);
        streamConnect(channel);
    })

}

async function sendToWebhook(msg){
  var embed = {
    author: {
      name: "Twitter Bot for Discord - V0.0.1 - Dev"
    },
    title: `New Tweet`,
    description: msg
  }
  var options = { method: 'POST',
    url: 'https://discordapp.com/api/webhooks/949197363875049552/yl1c3qDbpwsgWfqfG1fq7Nix6tGl0fCFhiDGGtDGA3YNei-MGNsh2KP_FJkddT6EWt34',
    headers:
     { 'cache-control': 'no-cache',
       'content-type': 'application/json' },
    body: { embeds:[embed] },
    json: true };

  request(options, function (error, response, body) {
    console.log(body);
  });
}

module.exports.addInRules = async function (kw) {
  var newRule = {'value':kw};
  rules.push(newRule);
  console.log(rules);
  console.log((newRule));
  let currentRules;
  try {
      currentRules = await getAllRules();
      await deleteAllRules(currentRules);
      await setRules();
  } catch (e) {
      console.error(e);
      process.exit(-1);
  }
}

module.exports.addInUser = async function (user) {
  var payload = 'from:' + user;
  var newRule = {'value':payload};
  rules.push(newRule);
  console.log(rules);
  console.log((newRule));
  let currentRules;
  try {
      currentRules = await getAllRules();
      await deleteAllRules(currentRules);
      await setRules();
  } catch (e) {
      console.error(e);
      process.exit(-1);
  }
}

module.exports.start = async function (channel){
  await start(channel);
  channel.send("running");
}
