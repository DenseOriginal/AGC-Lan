import { SlashCommandBuilder } from "@discordjs/builders";
import { ApplicationCommandPermissionData, CommandInteraction } from "discord.js";

export class BetterCommandBuilder extends SlashCommandBuilder {
  permissions: ApplicationCommandPermissionData[] = []
  action: (interaction: CommandInteraction) => void = () => {}

  setAction(action: (interaction: CommandInteraction) => void): this {
    this.action = action;
    return this;
  }

  addPermission(permission: ApplicationCommandPermissionData): this {
    this.permissions.push(permission);
    return this;
  }
}