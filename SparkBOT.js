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
    username: '<bot username>',
    password: '<oauth:token>'
  },
  channels: [ '<channel>' ]
};
// Create the lights on API command
const curl_on = new Curl();

curl_on.setOpt('URL', 'http://homegenie/api/HomeAutomation.ZWave/5/Control.On');
curl_on.setOpt('FOLLOWLOCATION', true);

curl_on.on('end', function (statusCode, data, headers) {
  console.info(statusCode);
  curl_on.close();
});

curl_on.on('error', curl_on.close.bind(curl_on));

// Create the lights off API command
const curl_off = new Curl();

curl_off.setOpt('URL', 'http://homegenie/api/HomeAutomation.ZWave/5/Control.Off');
curl_off.setOpt('FOLLOWLOCATION', true);

curl_off.on('end', function (statusCode, data, headers) {
  console.info(statusCode);
  curl_off.close();
});

curl_off.on('error', curl_off.close.bind(curl_off));

// Create a client with our options
const client = new tmi.client(opts);

// Register our event handlers (defined below)
client.on('message', onMessageHandler);
client.on('connected', onConnectedHandler);
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
  const commandName = (msg.trim()).toLowerCase();

  // If the command is known, let's execute it
  if(commandName.split(" ")[0] == '!hello') {
    client.say(target, `@${context.username}, heya!`);
    console.log(`* Executed ${commandName} command`);
  } else if (commandName.split(" ")[0] == '!bye') {
    client.say(target, `See you next time, @${context.username}!`);
    console.log(`* Executed ${commandName} command`);
  } else if (commandName.split(" ")[0] == '!light') {
    if (commandName.split(" ")[1] == 'on') {
      client.say(target, `Lights on!`);
      curl_on.perform();
      }
    else if (commandName.split(" ")[1] == 'off') {
      client.say(target, `Lights off, oohh cozy!!`);
      curl_off.perform();
      }
    else {
      client.say(target, `What would you like to do with the lights?`);
      client.say(target, `Usage: !lights [on/off]`);
      }
    console.log(`* Executed ${commandName} command`);
  } else {
    return;
  }
}
// Called every time the bot connects to Twitch chat
function onConnectedHandler (addr, port) {
  console.log(`* Connected to ${addr}:${port}`);
}
