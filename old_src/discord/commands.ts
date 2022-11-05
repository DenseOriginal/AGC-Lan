import Collection from "@discordjs/collection";
import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v9";
import { Interaction } from "discord.js";
import { environment } from "./environment";
import { whoIsCommand } from "./commands/whois";
import chalk from 'chalk';
import { BetterCommandBuilder } from "./helpers/command.class";
import { getSeatCommand } from "./commands/getseat";
import { sayCommand } from "./commands/say";

const rest = new REST({ version: '9' }).setToken(process.env.BOT_TOKEN as string || "");

const commands = [
  whoIsCommand,
  getSeatCommand,
  sayCommand
];
const commandCollection = new Collection<string, BetterCommandBuilder>();

export async function setupSlashCommands() {
  try {
    // discordjs broken, so use raw api
		await rest.put(
			Routes.applicationGuildCommands(environment.clientId, environment.guildId),
			{ body: commands.map(cmd => cmd.toJSON()) },
		);

		console.log(`[${chalk.bold.greenBright('BOT')}] Successfully reloaded application (/) commands`);
	} catch (error) {
		console.error(error);
	}

  // Save every command in a a collection, so that we can find it later using a name
  commands.forEach(cmd => {
    commandCollection.set(cmd.name, cmd);
  });
}

export async function handleInteractions(interaction: Interaction) {
  // If this interaction isn't a slash command, then exit
  if(!interaction.isCommand()) return;
  
  // Get the command
  const command = commandCollection.get(interaction.commandName);
  
  // if the command doesn't exist, the return
  if (!command) return;
  
  // Try to execute, and send an error
  try {
    await command.action(interaction);
  } catch (error) {
		console.error(`[${chalk.bold.red('BOT')}] Error while trying to run slash command '${interaction.commandName}'`);
    console.error(error);
    await interaction.reply({ content: 'Der er sket en fejl!', ephemeral: true });
  }
}