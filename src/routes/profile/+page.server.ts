import type { PageServerLoad } from "./$types";
import { redirect } from "@sveltejs/kit";
import { isPartialUser } from "$lib/helper/user";

export const load: PageServerLoad = (request) => {
	if (!request.locals.user) {
		throw redirect(301, '/');
	}
	
	if (isPartialUser(request.locals.user)) {
		throw redirect(301, '/profile/setup');
	}
}