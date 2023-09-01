import { Client, Message, GatewayIntentBits, ActivityType } from 'discord.js';
import { MONGO_URI } from './config';
import mongoose from 'mongoose';

export const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

export const initializeBot = (handleMessages: (message: Message) => Promise<void>): void => {
  if (!client) {
    console.error('Failed to create client.');
    process.exit(1);
  }
  setUserActivity();
  connectToMongoDB();

  client.on('messageCreate', handleMessages);
};

const connectToMongoDB = (): void => {
  console.log("Connecting to the Database ...")
  try {
    mongoose.connect(MONGO_URI, { keepAlive: true });
  } catch (err) {
    console.error('Failed to connect to MongoDB.');
    process.exit(1);
  }
  console.log("Connected to the Database")
};

const setUserActivity = (): void => {
  console.log("Tune the discord bot")
  if (!client.user) {
    console.error('Failed to get user.');
    process.exit(1);
  }
  client.user.setActivity('ℹ️ Commands: !help', { type: ActivityType.Custom })
  console.log(`Bot is ready! (${client.user.tag})`);
};
