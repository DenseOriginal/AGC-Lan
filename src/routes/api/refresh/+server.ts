import { error } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

const DISCORD_CLIENT_ID = import.meta.env.VITE_CLIENT_ID;
const DISCORD_CLIENT_SECRET = import.meta.env.VITE_CLIENT_SECRET;
const DISCORD_REDIRECT_URI = import.meta.env.VITE_CALLBACK_URL;

export const GET: RequestHandler = async ({ url }) => {
	const disco_refresh_token = url.searchParams.get('code');
	if (!disco_refresh_token) throw error(400, 'No refresh token found');

	// initializing data object to be pushed to Discord's token endpoint.
	// quite similar to what we set up in callback.js, expect with different grant_type.
	const dataObject = {
		client_id: DISCORD_CLIENT_ID,
		client_secret: DISCORD_CLIENT_SECRET,
		grant_type: 'refresh_token',
		redirect_uri: DISCORD_REDIRECT_URI,
		refresh_token: disco_refresh_token,
		scope: 'identify email guilds'
	};

	// performing a Fetch request to Discord's token endpoint
	const request = await fetch('https://discord.com/api/oauth2/token', {
		method: 'POST',
		body: new URLSearchParams(dataObject),
		headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
	});

	const response = await request.json();

	if (response.error) throw error(500, response.error);

	// redirect user to front page with cookies set
	const access_token_expires_in = new Date(Date.now() + response.expires_in); // 10 minutes
	const refresh_token_expires_in = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days
	console.log('set refreshed cookies');
	return new Response(JSON.stringify({ disco_access_token: response.access_token }), {
		headers: {
			'set-cookie': [
				`disco_access_token=${response.access_token}; Path=/; HttpOnly; SameSite=Strict; Expires=${access_token_expires_in}}`,
				`disco_refresh_token=${response.refresh_token}; Path=/; HttpOnly; SameSite=Strict; Expires=${refresh_token_expires_in}`,
			].join(', ')
		},
		status: 200,
	})
}