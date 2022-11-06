import { checkForDiscordRoles } from "$lib/discord/functions/check-for-roles";
import { isUserInServer } from "$lib/discord/functions/in-server";
import { verifyUser } from "$lib/discord/functions/verify-user";
import { botError } from "$lib/discord/helpers/log";
import { decodeJWT, updateJWT } from "$lib/helper/jwt";
import { isPartialUser, mapDocumentToUser } from "$lib/helper/user";
import { PartialUserModel } from "$lib/models/partial-user";
import { UserModel } from "$lib/models/user";
import type { PageServerLoad } from "./$types";
import { invalid, redirect, type Actions } from "@sveltejs/kit";

export const load: PageServerLoad = (request) => {
	if (!isPartialUser(request.locals.user)) {
		throw redirect(301, '/');
	}	
}

export const actions: Actions = {
	setupUser: async ({ request, locals, cookies }) => {
		const data = await request.formData();
		const user = locals.user;

		if (!user) return redirect(401, '/');

		if (!isPartialUser(user)) return redirect(300, '/');

		// Extract the old information from the old user
		// user is a partialUser in this context
		const {
			email,
			is_email_verified,
			username,
			refresh_token,
			picture_url,
			discord_id,
			created_at,
			accent_color,
		} = user;

		// Create the new user
		const newUser = new UserModel({
			first_name: data.get('firstname'),
			last_name: data.get('lastname'),
			class: (data.get('class') as string).toLocaleUpperCase(),
			email,
			is_email_verified,
			username,
			refresh_token,
			picture_url,
			discord_id,
			created_at,
			setup_finished: true,
			accent_color
		});

		try {
			// Try to save the user
			await newUser.save();

			// If saving the user succedes, the delete the partial user
			await PartialUserModel.deleteOne({ discord_id: newUser.discord_id }).exec();

			// Check if the user is in the server, before we try and verify the user
			if (!(await isUserInServer(newUser.discord_id))) throw redirect(300, '/discord');

			// When the user has been setup verify the user
			verifyUser(newUser.discord_id).catch((e) => botError('Verify error: ', e));
			checkForDiscordRoles(newUser).catch((e) => botError('Check for roles error: ', e));

			const jwt = cookies.get('aglan_jwt');
			const jwtUser = jwt ? decodeJWT(jwt) : false;

			if (!jwtUser) throw redirect(300, '/');

			const newJwt = updateJWT(jwtUser, {
				id: newUser._id.toString(),
			});
			const jwtExpireIn = new Date(Date.now() + 10 * 24 * 60 * 60 * 1000); // 10 days
			console.log('newJwt', newJwt);
			
			cookies.set('aglan_jwt', newJwt, { httpOnly: true, sameSite: 'strict', expires: jwtExpireIn, path: '/' });

			// Redirect the new use to ther profile page
			throw redirect(300, '/?reload=true');
		} catch (error) {
			// TODO: implement better error handling
			// If an error happens log the error, and send status 500 (Internal server error)
			console.log(error);
			return invalid(500, { message: 'Something went wrong' });
		}
	}
}