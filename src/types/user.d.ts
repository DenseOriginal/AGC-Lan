export interface DiscordAPIUser {
	id: string;
	username: string;
	avatar: string;
	avatar_decoration: null,
	discriminator: string;
	public_flags: number;
	flags: number;
	banner: null;
	banner_color: null;
	accent_color: null;
	locale: string;
	mfa_enabled: boolean;
	premium_type: number;
	email: string;
	verified: boolean;
}

export interface User {
	first_name: string;
	last_name: string;
	email: string;
	is_email_verified: boolean;
	username: string;
	refresh_token: string;
	last_login: Date;
	created_at: Date;
	class: string;
	phone: string;
	banned: boolean;
	notes: string[];
	picture_url: string;
	discord_id: string;
	setup_finished: true;
	accent_color: string;
	role: "USER" | "STAFF" | "ADMIN" | "SUPERADMIN";
	_id: string;
}

export interface PartialUser {
	email: string;
	is_email_verified: boolean;
	username: string;
	refresh_token: string;
	picture_url: string;
	discord_id: string;
	created_at: Date;
	setup_finished: false;
	accent_color: string;
	_id: string;
}

export type AnyUser = User | PartialUser;