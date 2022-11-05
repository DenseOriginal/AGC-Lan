import type { RequestHandler } from "./$types";

export const GET: RequestHandler = () => {
	return new Response(null, {
		headers: {
		  'set-cookie': `aglan_jwt=deleted; Path=/; Max-Age=-1`,
		  Location: '/'
		},
		status: 302
	});
}