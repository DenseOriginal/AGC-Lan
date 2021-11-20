import { client } from "../client";
import { environment } from "../environment";

export async function verifyUser(userId: string) {
  const guild = await client.guilds.fetch(environment.guildId);
  const user = await guild.members.fetch(userId);
  const verifiedRole = await guild.roles.fetch(environment.verifiedRoleId);
  if(!verifiedRole) throw new Error("Can't find Verified role");
  await user.roles.add(verifiedRole);
}