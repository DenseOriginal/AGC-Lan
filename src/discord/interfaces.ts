import { SlashCommandBuilder } from "@discordjs/builders";
import { ApplicationCommandPermissionData, CommandInteraction } from "discord.js";

export interface IDiscordCommand {
  data: SlashCommandBuilder,
  execute(interaction: CommandInteraction): void,
  permissions?: ApplicationCommandPermissionData[]
}