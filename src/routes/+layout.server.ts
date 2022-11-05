import type { LayoutServerLoad } from "./$types";
import { getUserFromDiscordToken, mapDocumentToUser } from "$lib/helper/user";
import { UserModel } from "$lib/models/user";
import { PartialUserModel } from "$lib/models/partial-user";
import type { PartialUser, User } from "src/types/user";

export const load: LayoutServerLoad = async (request) => {
	const refreshToken = request.cookies.get('disco_refresh_token');
	const accessToken = request.cookies.get('disco_access_token');

	const discordUser = await getUserFromDiscordToken(refreshToken, accessToken);

	if (!discordUser) return { user: undefined };

	// Check if the user already exist
	const user = await UserModel.findOne({ "discord_id": discordUser.id }).exec();

	if (user) {
		// If a user was found
		// Then update the last_login with now, and the refresh_token
		// And then refresh the data pulled from discord, as the user might have changed their profile
		await user.updateOne({
			last_login: new Date(),
			refresh_token: refreshToken,
			username: discordUser.username + '#' + discordUser.discriminator,
			picture_url: 
				`https://cdn.discordapp.com/avatars/${discordUser?.id}/${discordUser?.avatar}.png` ||
				"https://cdn.discordapp.com/embed/avatars/3.png",
			accent_color: discordUser.banner_color || `hsla(${~~(360 * Math.random())},70%,70%,0.8)`,
		}).exec();

		return { user: mapDocumentToUser(user) };
	} else {
		// If user doesn't exist, check if a partial user exist
		const partialUser = await PartialUserModel.findOne({ "discord_id": discordUser.id }).exec();

		if(partialUser) {
		  return { user: mapDocumentToUser(partialUser) };
		}
  
		// If partial user doesnt exist, then create a new partial
  
		// Create partial user if no user exists
		const newPartial = new PartialUserModel({
		  email: discordUser.email,
		  is_email_verified: discordUser.verified,
		  username: discordUser.username + '#' + discordUser.discriminator,
		  refresh_token: refreshToken,
		  // If the user doesn't have a profile picture, give them the default discord pfp
		  picture_url: 
				`https://cdn.discordapp.com/avatars/${discordUser?.id}/${discordUser?.avatar}.png` ||
				"https://cdn.discordapp.com/embed/avatars/3.png",
		  discord_id: discordUser.id,
		  accent_color: discordUser.banner_color || `hsla(${~~(360 * Math.random())},70%,70%,0.8)`,
		});
  
		await newPartial.save();
	}
}
