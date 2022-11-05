import type { LayoutServerLoad } from "./$types";
import type { User } from "src/types/user";

const DISCORD_API_URL = 'https://discordapp.com/api';
const HOST = import.meta.env.VITE_HOST;

export const load: LayoutServerLoad = async (request) => {
	const refreshToken = request.cookies.get('disco_refresh_token');
	const accessToken = request.cookies.get('disco_access_token');

	// if only refresh token is found, then access token has expired. perform a refresh on it.
	if (refreshToken && !accessToken) {
	  const discord_request = await fetch(`${HOST}/api/refresh?code=${refreshToken}`);
	  const discord_response = await discord_request.json();
  
	  if (discord_response.disco_access_token) {
		const request = await fetch(`${DISCORD_API_URL}/users/@me`, {
		  headers: { 'Authorization': `Bearer ${discord_response.disco_access_token}` }
		});
	
		// returns a discord user if JWT was valid
		const response = await request.json() as User;
	
		if (response.id) {
		  return {
			user: response
		  }
		}
	  }
	}
  
	if (accessToken) {
	  const request = await fetch(`${DISCORD_API_URL}/users/@me`, {
		headers: { 'Authorization': `Bearer ${accessToken}`}
	  });
  
	  // returns a discord user if JWT was valid
	  const response = await request.json() as User;
  
	  if (response.id) {
		return {
		  user: response
		}
	  }
	}
  
	// not authenticated, return empty user object
	return {
	  user: undefined
	}
}

function mapUser(user: User) {
	
}