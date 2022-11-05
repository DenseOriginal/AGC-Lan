import { Intents, Client } from "discord.js";
import { handleInteractions, setupSlashCommands } from "./commands";
import chalk from 'chalk';
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

let hasRunSetup = false;
export async function setupOnce() {
	if (hasRunSetup) return;
	hasRunSetup = true;

	try {
		botLog(`Setting up bot`);
		client.login(import.meta.env.VITE_BOT_TOKEN || "");
		setupSlashCommands();
	} catch (error) {
		botError('Failed to setup')
		console.error(error);
	}
}

client.on('interactionCreate', handleInteractions);