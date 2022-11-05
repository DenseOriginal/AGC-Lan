import type { DiscordAPIError } from "discord.js";
import { client } from "../client";
import { environment } from "../environment";

export async function isUserInServer(discordId: string): Promise<boolean> {
  try {
    const guild = await client.guilds.fetch(environment.guildId);
    const isUserInGuild = await guild.members.fetch(discordId);
    return true;
  } catch (error) {
    if((error as DiscordAPIError)?.message != 'Unknown Member') console.error(error);
    return false;
  }
}