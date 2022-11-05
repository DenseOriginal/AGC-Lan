export interface User {
	id: string;
	username: string;
	avatar: string;
	avatar_decoration: null,
	descriminator: string;
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
