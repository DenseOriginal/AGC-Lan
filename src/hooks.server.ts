import "$lib/discord/client";
import "$lib/services/db";
import { decodeJWT, updateJWT } from "$lib/helper/jwt";
import { getDiscordUserWithToken, getNewAccessToken, updateUserWithDiscordData } from "$lib/helper/user";
import type { Handle } from "@sveltejs/kit";

export const handle: Handle = async ({ event, resolve }) => {
	const jwt = event.cookies.get('aglan_jwt');
	const jwtUser = jwt ? decodeJWT(jwt) : false;

	if (jwtUser) {
		// Get the access token from the JWT, or get a new one
		const hasAccessTokenExpired = new Date(jwtUser.accessTokenExpiresAt) < new Date();
		const accessToken = hasAccessTokenExpired ?
			await getNewAccessToken(jwtUser.id) :
			jwtUser.accessToken;

		// Get the latest data from discord
		// If the user has updated their username, avatar, etc
		const discordUser = await getDiscordUserWithToken(
			accessToken
		);

		if (!discordUser) throw new Error('Invalid JWT');

		// Get and update the user in the database
		const user = await updateUserWithDiscordData(discordUser);

		// Issue a new JWT with the updated data
		const newJWT = updateJWT(jwtUser, { accessToken });
		const jwtExpireIn = new Date(Date.now() + 10 * 24 * 60 * 60 * 1000); // 10 days
		event.cookies.set('aglan_jwt', newJWT, { httpOnly: true, sameSite: 'strict', expires: jwtExpireIn, path: '/' });

		// Update the user in the request
		event.locals.user = user;
	}

	return await resolve(event);
};