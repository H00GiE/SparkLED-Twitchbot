const tmi = require('tmi.js');
const { Curl } = require('node-libcurl');

// Define configuration options
const opts = {
  identity: {
    username: '<replace with your twitchbot's username>',
    password: '<replace with your twitchbot's twitch oauth>'
  },
  channels: [
    '<replace with the twitch channelname you want your bot to be in>'
  ]
};
// Create the lights on API command
const curl_on = new Curl();

curl_on.setOpt('URL', 'http://url of controller/api/command.On');
curl_on.setOpt('FOLLOWLOCATION', true);

curl_on.on('end', function (statusCode, data, headers) {
  console.info(statusCode);
  console.info('---');
  this.close();
});

curl_on.on('error', curl_on.close.bind(curl_on));

// Create the lights off API command
const curl_off = new Curl();

curl_off.setOpt('URL', 'http://url of controller/api/command.Off');
curl_off.setOpt('FOLLOWLOCATION', true);

curl_off.on('end', function (statusCode, data, headers) {
  console.info(statusCode);
  console.info('---');
  this.close();
});

curl_off.on('error', curl_off.close.bind(curl_off));

// Create a client with our options
const client = new tmi.client(opts);

// Register our event handlers (defined below)
client.on('message', onMessageHandler);
client.on('connected', onConnectedHandler);

// Connect to Twitch:
client.connect();

// Called every time a message comes in
function onMessageHandler (target, context, msg, self) {
  if (self) { return; } // Ignore messages from the bot

  // Remove whitespace from chat message
  const commandName = msg.trim();

  // If the command is known, let's execute it
  if (commandName === '!hello') {
    client.say(target, `Hello to you too!`);
    console.log(`* Executed ${commandName} command`);
  } else if (commandName === '!bye') {
    client.say(target, `See you next time!`);
    console.log(`* Executed ${commandName} command`);
  } else if (commandName === '!on') {
    client.say(target, `Lights on!`);
    curl_on.perform();
    console.log(`* Executed ${commandName} command`);
  } else if (commandName === '!off') {
    client.say(target, `Lights off, oohh cozy!!`);
    curl_off.perform();
    console.log(`* Executed ${commandName} command`);
  } else {
    console.log(`* Unknown command ${commandName}`);
  }
}
// Called every time the bot connects to Twitch chat
function onConnectedHandler (addr, port) {
  console.log(`* Connected to ${addr}:${port}`);
}
