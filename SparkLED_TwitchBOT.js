const tmi = require('tmi.js');
const { Curl } = require('node-libcurl');

// Define configuration options
const opts = {
  options: { debug: true },
  connection: {
	secure: true,
	reconnect: true
  },
  identity: {
    username: '<botusername>',
    password: '<oauth:key>'
  },
  channels: [ '<channel>' ]
};

// Create the lights off API command
function sendCommandAPI (args) {
const curl = new Curl();

const action = args[0].charAt(0).toUpperCase() + args[0].substring(1);
const value1 = args[1];

curl.setOpt('URL', '<RESTful API URL/IP>'+action);
curl.setOpt('FOLLOWLOCATION', true);

curl.on('end', function (statusCode, data, headers) {
  console.info(statusCode);
  curl.close();
});
curl.on('error', curl.close.bind(curl));
curl.perform();
} 

// Create a client with our options
const client = new tmi.client(opts);

// Register our event handlers (defined below)
client.on('message', onMessageHandler);
client.on('connected', onConnectedHandler);

// Connect to Twitch:
client.connect();

// Called every time a message comes in on Twitch
function onMessageHandler (channel, tags , message, self) {
  if(self || !message.startsWith('!')) {
    return;
  } // Ignore messages NOT starting with "!" and ignore all messages from bot.

  // make command and args work
  const args = message.slice('!'.length).split(/\s+/);
  const commandName = args.shift().toLowerCase();

  // If the command is known, let's execute it
 
  if(commandName === 'test') {
    client.say(channel, `@${tags.username}, I'm here and ready! copyThis pastaThat I think... `); 
    client.say(channel, `...wait a minute, PogChamp since when can I think?!`);
    console.log(`* Executed ${commandName} command`);
  } else if (commandName === 'light') {
    if (args[0] === 'on') {
      client.say(channel, `Lights on!`);
      sendCommandAPI(args);
      }
    else if (args[0] === 'off') {
      client.say(channel, `Lights off, oohh cozy!!`);
      sendCommandAPI(args);
      }
    else {
      client.say(channel, `OOPS: What would you like to do with the lights?  -  Usage: !light [on/off]`);
      }
    console.log(`* Executed ${commandName} [${args}] command`);
  } else {
    return;
  }
}
// Called every time the bot connects to Twitch chat
function onConnectedHandler (addr, port) {
  console.log(`* Connected to ${addr}:${port}`);
}
