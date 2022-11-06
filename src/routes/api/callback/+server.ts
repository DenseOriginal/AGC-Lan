import { createJWT } from "$lib/helper/jwt";
import { createPartialUser, getDiscordUserWithToken, updateUserWithDiscordData, profileExists, updateDiscordRefreshToken } from "$lib/helper/user";
import { error } from "@sveltejs/kit";
import type { User } from "src/types/user";
import type { RequestHandler } from "./$types";

const DISCORD_CLIENT_ID = import.meta.env.VITE_CLIENT_ID;
const DISCORD_CLIENT_SECRET = import.meta.env.VITE_CLIENT_SECRET;
const DISCORD_REDIRECT_URI = import.meta.env.VITE_CALLBACK_URL;

export const GET: RequestHandler = async ({ url }) => {
	// fetch returnCode set in the URL parameters.
	const returnCode = url.searchParams.get('code');

	if (!returnCode) throw error(400, 'No return code');

	// initializing data object to be pushed to Discord's token endpoint.
	// the endpoint returns access & refresh tokens for the user.
	const dataObject = {
		client_id: DISCORD_CLIENT_ID,
		client_secret: DISCORD_CLIENT_SECRET,
		grant_type: 'authorization_code',
		redirect_uri: DISCORD_REDIRECT_URI,
		code: returnCode,
		scope: 'identify email guilds'
	};

	// performing a Fetch request to Discord's token endpoint
	const request = await fetch('https://discord.com/api/oauth2/token', {
		method: 'POST',
		body: new URLSearchParams(dataObject),
		headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
	});
	
	const response = await request.json();
	
	// redirect to front page in case of error
	if (response.error) {
		return new Response(null, {
			headers: { Location: '/' },
			status: 302
		})
	}

	const discordUser = await getDiscordUserWithToken(response.access_token);
	
	if (!discordUser) throw error(400, 'No discord user found');

	const hasProfile = await profileExists(discordUser.id);

	const [user] = await Promise.all([
		hasProfile ? 
			updateUserWithDiscordData(discordUser) :
			createPartialUser(discordUser, response.refresh_token),
		updateDiscordRefreshToken('discord_id', discordUser.id, response.refresh_token, !hasProfile)
	])

	if (hasProfile && !user) throw error(400, 'No user found');

	// redirect user to front page with cookies set
	const jwtExpireIn = new Date(Date.now() + 10 * 24 * 60 * 60 * 1000); // 10 days
	const userJwt = createJWT(user as User, response.access_token, response.expires_in);
	return new Response(null, {
		headers: {
			'set-cookie': `aglan_jwt=${userJwt}; Path=/; HttpOnly; SameSite=Strict; Expires=${jwtExpireIn}}`,
			Location: hasProfile ? '/?reload=true' : '/profile/setup'
		},
		status: 302
	})
}
