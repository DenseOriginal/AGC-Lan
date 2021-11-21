import { client } from "../client";
import { environment } from "../environment";

export async function verifyUser(userId: string) {
  const guild = await client.guilds.fetch(environment.guildId);
  const user = await guild.members.fetch(userId);
  user.roles.add(environment.verifiedRoleId);
}