import "$lib/discord/client";
import "$lib/services/db";
import { decodeJWT, updateJWT } from "$lib/helper/jwt";
import { getDiscordUserFromTokens, getUserAsLogin } from "$lib/helper/user";
import type { Handle } from "@sveltejs/kit";

export const handle: Handle = async ({ event, resolve }) => {
	const jwt = event.cookies.get('aglan_jwt');
	const jwtUser = jwt ? decodeJWT(jwt) : false;

	if (jwtUser) {
		const hasAccessTokenExpired = new Date(jwtUser.accessTokenExpiresAt) < new Date();
		const { discordUser, refreshToken } = await getDiscordUserFromTokens(
			jwtUser.refreshToken,
			hasAccessTokenExpired ? undefined : jwtUser.accessToken
		);

		if (!discordUser) throw new Error('Invalid JWT');

		const user = await getUserAsLogin(discordUser, refreshToken);

		const newJWT = updateJWT(jwtUser, { refreshToken });

		const jwtExpireIn = new Date(Date.now() + 10 * 24 * 60 * 60 * 1000); // 10 days
		event.cookies.set('aglan_jwt', newJWT, { httpOnly: true, sameSite: 'strict', expires: jwtExpireIn });

		event.locals.user = user;
	}

	return await resolve(event);
};