import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = async (request) => {
	return { user: request.locals.user };
}
