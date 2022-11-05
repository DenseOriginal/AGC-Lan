import type { RequestHandler } from "./$types";

export const GET: RequestHandler = () => {
	return new Response(null, {
		headers: {
		  'set-cookie': [
			`disco_access_token=deleted; Path=/; Max-Age=-1`,
			`disco_refresh_token=deleted; Path=/; Max-Age=-1`,
		  ].join(', '),
		  Location: '/'
		},
		status: 302
	});
}