import { client } from "../client";

export async function verifyUser(userId: string) {
  const guild = await client.guilds.fetch(process.env.DISCORD_GUILD_ID as string);
  const user = await guild.members.fetch(userId);
  const verifiedRole = await guild.roles.cache.find(role => role.name == "Verified");
  if(!verifiedRole) throw new Error("Can't find Verified role");
  await user.roles.add(verifiedRole);
}