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

  // Setup permissions

  // Get all the guildCommand id's
  // guild.commands.fetch() doesn't work, and results a wierd error
  // Se we can use rest instead
  // We can also infer our own type, but we only need the id and name
  const commandsFromAPI = await rest.get(Routes.applicationGuildCommands(environment.clientId, environment.guildId)) as { id: string, name: string }[];

  // Loop through all fetched commands, and set permissions
  for (const { id, name } of commandsFromAPI) {
    // Get the command from the collection
    const command = commandCollection.get(name);

    if(!command) continue; // If the command doesn't exist, then continue
    if(!command.permissions) continue; // If the command doesn't have ane restrictions, then continue

    // discordjs seems broken, so we need to use raw api
    // https://discord.com/developers/docs/interactions/application-commands#get-guild-application-command-permissions
    await rest.put(
      Routes.applicationCommandPermissions(environment.clientId, environment.guildId, id),
      { body: { permissions: command.permissions } }
    )
  }
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