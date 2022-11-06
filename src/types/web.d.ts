export interface ApiError {
	status: number;
	message: string | Error;
}

export interface RequestOptions {
	body: any;
	method: 'GET' | 'POST' | 'PUT' | 'DELETE';
}