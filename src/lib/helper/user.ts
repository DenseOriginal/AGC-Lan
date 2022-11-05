import type { DiscordAPIUser, PartialUser, User } from "src/types/user";
import type { Document } from "mongoose";
import { UserModel } from "$lib/models/user";
import { PartialUserModel } from "$lib/models/partial-user";
import { error } from "@sveltejs/kit";

const DISCORD_API_URL = 'https://discordapp.com/api';
const HOST = import.meta.env.VITE_HOST;

export async function getDiscordUserFromTokens(
	refreshToken: string | undefined,
	accessToken: string | undefined
) {
	// if only refresh token is found, then access token has expired. perform a refresh on it.
	if (refreshToken && !accessToken) {
		const {
			refreshToken: newRefreshToken,
			accessToken: newAccessToken
		} = await refreshAccessToken(refreshToken);
		
		const request = await fetch(`${DISCORD_API_URL}/users/@me`, {
			headers: { 'Authorization': `Bearer ${newAccessToken}` }
		});

		// returns a discord user if JWT was valid
		const response = await request.json() as DiscordAPIUser;

		if (response.id) {
			return { discordUser: response, refreshToken: newRefreshToken };
		}
	}

	if (accessToken) {		
		const request = await fetch(`${DISCORD_API_URL}/users/@me`, {
			headers: { 'Authorization': `Bearer ${accessToken}` }
		});

		// returns a discord user if JWT was valid
		const response = await request.json() as DiscordAPIUser;

		if (response.id) {
			return { discordUser: response, refreshToken: refreshToken };
		}
	}

	return { discordUser: undefined, refreshToken: undefined };
}

export async function profileExists(discordId: string) {
	const user = await UserModel.exists({ discord_id: discordId });
	return user !== null;
}

export async function getUserAsLogin(discordUser: DiscordAPIUser, refreshToken: string) {
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

		return mapDocumentToUser(user);
	} else {
		// If user doesn't exist, check if a partial user exist
		const partialUser = await PartialUserModel.findOne({ "discord_id": discordUser.id }).exec();

		if (partialUser) {
			return mapDocumentToUser(partialUser);
		}

		return undefined;
	}
}

export async function createPartialUser(discordUser: DiscordAPIUser, refreshToken: string) {
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

	return mapDocumentToUser(newPartial);
}


export async function refreshAccessToken(refreshToken: string) {
	// initializing data object to be pushed to Discord's token endpoint.
	// quite similar to what we set up in callback.js, expect with different grant_type.
	const dataObject = {
		client_id: import.meta.env.VITE_CLIENT_ID,
		client_secret: import.meta.env.VITE_CLIENT_SECRET,
		grant_type: 'refresh_token',
		refresh_token: refreshToken,
	};

	// performing a Fetch request to Discord's token endpoint
	const request = await fetch('https://discord.com/api/oauth2/token', {
		method: 'POST',
		body: new URLSearchParams(dataObject),
		headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
	});

	const response = await request.json();

	if (response.error) throw error(500, response.error);

	return {
		accessToken: response.access_token,
		refreshToken: response.refresh_token
	}
}

export function mapDocumentToUser<T extends User | PartialUser>(documeny: Document<unknown, any, T> & T): T {
	const user = documeny.toObject<T>();
	user._id = user._id.toString();
	return user;
}
