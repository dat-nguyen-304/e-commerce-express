const { Client, GatewayIntentBits } = require('discord.js');
require('dotenv').config();

class LoggerService {
  constructor() {
    this.client = new Client({
      intents: [
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
      ],
    });

    this.channelId = process.env.CHANNEL_DISCORD_ID;
    this.client.on('ready', () => {
      console.log(`Logged is as ${this.client.user.tag}`);
    });
    this.client.login(process.env.DISCORD_TOKEN);
  }

  sendToFormatCode(log) {
    const { code, title, message } = log;
    const codeMessage = {
      content: message,
      embeds: [
        {
          color: parseInt('00ff00', 16),
          title,
          description: '```json\n' + JSON.stringify(code, null, 2) + '\n```',
        },
      ],
    };
    const channel = this.client.channels.cache.get(this.channelId);
    if (!channel) {
      console.error('Could not find the channel ', this.channelId);
      return;
    }

    channel.send(codeMessage).catch((e) => console.log(e));
  }

  sendMessage(message = 'message') {
    const channel = this.client.channels.cache.get(this.channelId);
    if (!channel) {
      console.error('Could not find the channel ', this.channelId);
      return;
    }

    channel.send(message).catch((e) => console.log(e));
  }
}

module.exports = new LoggerService();
