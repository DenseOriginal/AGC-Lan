import type { DiscordAPIUser, PartialUser, User } from "src/types/user";
import type { Document } from "mongoose";

const DISCORD_API_URL = 'https://discordapp.com/api';
const HOST = import.meta.env.VITE_HOST;

export async function getUserFromDiscordToken(
	refreshToken: string | undefined,
	accessToken: string | undefined
) {
	// if only refresh token is found, then access token has expired. perform a refresh on it.
	if (refreshToken && !accessToken) {
		const discord_request = await fetch(`${HOST}/api/refresh?code=${refreshToken}`);
		const discord_response = await discord_request.json();

		if (discord_response.disco_access_token) {
			const request = await fetch(`${DISCORD_API_URL}/users/@me`, {
				headers: { 'Authorization': `Bearer ${discord_response.disco_access_token}` }
			});

			// returns a discord user if JWT was valid
			const response = await request.json() as DiscordAPIUser;

			if (response.id) {
				return response;
			}
		}
	}

	if (accessToken) {
		const request = await fetch(`${DISCORD_API_URL}/users/@me`, {
			headers: { 'Authorization': `Bearer ${accessToken}` }
		});

		// returns a discord user if JWT was valid
		const response = await request.json() as DiscordAPIUser;

		if (response.id) {
			return response;
		}
	}

	return undefined;
}

export function mapDocumentToUser<T extends User | PartialUser>(documeny: Document<unknown, any, T> & T): T {
	const user = documeny.toObject<T>();
	user._id = user._id.toString();
	return user;
}
