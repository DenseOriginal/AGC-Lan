import type { ApiError, RequestOptions } from "src/types/web";

export async function requestJson<T>(url: string, options: RequestOptions): Promise<T | ApiError> {
	try {
		const response = await fetch(url, {
			method: options.method,
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(options.body)
		})

		if (response.ok) {
			const data = await response.json();
			return data as T;
		}

		console.error('Request failed', response);
		return { status: 500, message: 'Something happened' };
	} catch (error) {
		console.error(error);
		return { status: 500, message: 'Something happened' };
	}
}

export function isApiError(data: any): data is ApiError {
	return data.status !== undefined && data.message !== undefined;
}