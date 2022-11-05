import type { RequestHandler } from "@sveltejs/kit";

const DISCORD_CLIENT_ID = import.meta.env.VITE_CLIENT_ID;
const DISCORD_REDIRECT_URI = import.meta.env.VITE_CALLBACK_URL;
const DISCORD_ENDPOINT = `https://discord.com/api/oauth2/authorize?client_id=${DISCORD_CLIENT_ID}&redirect_uri=${encodeURIComponent(DISCORD_REDIRECT_URI)}&response_type=code&scope=identify%20email%20guilds`;


export const GET: RequestHandler = async () => {
	return new Response(null, {
		headers: { Location: DISCORD_ENDPOINT },
		status: 302,
	})
}