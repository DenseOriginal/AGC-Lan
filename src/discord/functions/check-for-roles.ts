import { UserAsDocument } from "../../models/user";
import { client } from "../client";
import { environment } from "../environment";

// This function checks to see if a user is a staff, admin or superadmin on the discord
// And then updates their role accordingly
export async function checkForDiscordRoles(dbUser: UserAsDocument) {
  const guild = await client.guilds.fetch(environment.guildId);
  const discordUser = await guild.members.fetch(dbUser.discord_id);
  const highestRole = discordUser.roles.highest;

  if(highestRole.id == environment.staffRoleId) return dbUser.updateOne({ role: 'STAFF' }).exec();
  if(highestRole.id == environment.adminRoleId) return dbUser.updateOne({ role: 'ADMIN' }).exec();
  if(highestRole.id == environment.superAdminRoleId) return dbUser.updateOne({ role: 'SUPERADMIN' }).exec();
}