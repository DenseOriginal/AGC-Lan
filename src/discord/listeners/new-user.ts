import { ArgsOf, Client, Discord, On } from "discordx";
import { UserModel } from "../../models/user";
import { environment } from "../environment";

@Discord()
class OnNewUser {
  @On('guildMemberAdd')
  private async newUser(
    [member]: ArgsOf<"guildMemberAdd">,
  ) {
    try {
      const dbUser = await UserModel.findOne({ discord_id: member.id }).exec();
      if(dbUser) member.roles.add(environment.verifiedRoleId);
    } catch (error) {
      console.error(error);
    }
  }
}