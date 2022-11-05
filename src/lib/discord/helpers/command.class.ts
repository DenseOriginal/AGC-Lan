import { SlashCommandBuilder } from "@discordjs/builders";
import type { ApplicationCommandPermissionData, CommandInteraction } from "discord.js";

export class BetterCommandBuilder extends SlashCommandBuilder {
  permissions: ApplicationCommandPermissionData[] = []
  action: (interaction: CommandInteraction) => void = () => {}

  setAction(action: (interaction: CommandInteraction) => void): this {
    this.action = action;
    return this;
  }
}