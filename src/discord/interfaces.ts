import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";

export interface IDiscordCommand {
  data: SlashCommandBuilder,
  execute(interaction: CommandInteraction): void
}