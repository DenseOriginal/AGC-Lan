import { Intents, Client } from "discord.js";
import { handleInteractions, setupSlashCommands } from "./commands";
import { botError, botLog } from "./helpers/log";


export const client = new Client({
	intents: [
		Intents.FLAGS.GUILDS,
		Intents.FLAGS.GUILD_MESSAGES,
		Intents.FLAGS.GUILD_MEMBERS,
	],
});

// Setup listeners
// import "./listeners/new-user";
botError('---------------- Remember to activate the listeners ----------------');

client.on("ready", async () => {
	botLog(`Ready!`);
});

client.on('error', (error) => {
	botError('An error occured', error);
});

try {
	botLog(`Setting up bot`);
	client.destroy();
	client.login(import.meta.env.VITE_BOT_TOKEN || "");
	setupSlashCommands();
} catch (error) {
	botError('Failed to setup')
	console.error(error);
}

client.on('interactionCreate', handleInteractions);