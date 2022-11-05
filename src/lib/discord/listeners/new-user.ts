import { GuildMember } from "discord.js";
import { UserModel } from "../../models/user";
import { client } from "../client";
import { environment } from "../environment";


client.on('guildMemberAdd', async (member: GuildMember) => {
  try {
    const dbUser = await UserModel.findOne({ discord_id: member.id }).exec();
    if(dbUser) member.roles.add(environment.verifiedRoleId);
  } catch (error) {
    console.error(error);
  }
});