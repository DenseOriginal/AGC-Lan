import { Intents, Client } from "discord.js";
import { handleInteractions, setupSlashCommands } from "./commands";
import chalk from 'chalk';

export const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_MEMBERS,
  ],
});

// Setup listeners
import "./listeners/new-user";

client.on("ready", async () => {
  console.log(`[${chalk.bold.greenBright('BOT')}] started`);
});

export async function run() {
  client.login(process.env.BOT_TOKEN as string || "");
  setupSlashCommands();
}

client.on('interactionCreate', handleInteractions);