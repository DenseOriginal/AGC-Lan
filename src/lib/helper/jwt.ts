import type { AnyUser } from "src/types/user"
import jwt from "jsonwebtoken";

export interface JWT {
	id: string;
	discordId: string;
	accessToken: string;
	accessTokenExpiresAt: string;
}

export function createJWT(user: AnyUser, accessToken: string, expiresIn: number): string {
	return jwt.sign({
		id: user._id,
		discordId: user.discord_id,
		accessToken,
		accessTokenExpiresAt: new Date(Date.now() + expiresIn),
	}, import.meta.env.VITE_SESSION_SECRET, { expiresIn: '10d' });
}

export function updateJWT(prev: JWT, update: Partial<JWT>) {
	delete (prev as any)['exp'];
	delete (prev as any)['iat'];

	return jwt.sign({
		...prev,
		...update,
	}, import.meta.env.VITE_SESSION_SECRET, { expiresIn: '10d' });
}

export function decodeJWT(token: string): JWT | false {
	try {
		return jwt.verify(token, import.meta.env.VITE_SESSION_SECRET) as JWT;
	} catch (error) {
		return false;
	}
}
