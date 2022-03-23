import Collection from "@discordjs/collection";
import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v9";
import { Interaction } from "discord.js";
import { environment } from "../environment";
import { IDiscordCommand } from "../interfaces";
import { whoIsCommand } from "./whois";

const rest = new REST({ version: '9' }).setToken(process.env.BOT_TOKEN as string || "");

const commands = [
  whoIsCommand
];
const commandCollection = new Collection<string, IDiscordCommand>();

export async function setupSlashCommands() {
  try {
		console.log('Started refreshing application (/) commands.');

		await rest.put(
			Routes.applicationGuildCommands(environment.clientId, environment.guildId),
			{ body: commands.map(cmd => cmd.data.toJSON()) },
		);

		console.log('Successfully reloaded application (/) commands.');
	} catch (error) {
		console.error(error);
	}

  commands.forEach(cmd => {
    commandCollection.set(cmd.data.name, cmd);
  });
}

export async function handleInteractions(interaction: Interaction) {
  if(!interaction.isCommand()) return;
  
  const command = commandCollection.get(interaction.commandName);
  
  if (!command) return;
  
  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    await interaction.reply({ content: 'Der er sket en fejl!', ephemeral: true });
  }
}