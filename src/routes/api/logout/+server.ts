import { redirect } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = (event) => {
	event.cookies.delete('aglan_jwt', { path: '/' })
	throw redirect(302, '/');
}