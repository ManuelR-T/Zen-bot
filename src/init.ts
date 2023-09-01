import { Client, Message, GatewayIntentBits } from 'discord.js';
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
    try {
        mongoose.connect(MONGO_URI, { keepAlive: true });
    } catch (err) {
        console.error('Failed to connect to MongoDB.');
        process.exit(1);
    }
};

const setUserActivity = (): void => {
    if (!client.user) {
        console.error('Failed to get user.');
        process.exit(1);
    }
    client.user.setActivity('Commands: !help', { type: 4 });
    console.log(`Bot is ready! (${client.user.tag})`);
};
