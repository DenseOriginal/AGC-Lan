import Collection from "@discordjs/collection";
import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v9";
import type { Interaction } from "discord.js";
import { environment } from "./environment";
// import { whoIsCommand } from "./commands/whois";
import type { BetterCommandBuilder } from "./helpers/command.class";
// import { getSeatCommand } from "./commands/getseat";
import { sayCommand } from "./commands/say";
import { botError, botInfo, botLog } from "./helpers/log";

const rest = new REST({ version: '9' }).setToken(import.meta.env.VITE_BOT_TOKEN || "");

const commands = [
//   whoIsCommand,
//   getSeatCommand,
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

		botLog(`Successfully reloaded application (/) commands`);
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

  botInfo(`User ${interaction.user.tag} (${interaction.user.id}) used command '${interaction.commandName}'`);
  
  // Try to execute, and send an error
  try {
    await command.action(interaction);
  } catch (error) {
		botError(`Error while trying to run slash command '${interaction.commandName}'. UserID: ${interaction.user.id}`);
		console.error(error);
		await interaction.reply({ content: 'Der er sket en fejl!', ephemeral: true });
  }
}