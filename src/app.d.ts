// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
// and what to do when importing types
declare namespace App {
	interface Locals {
		user: AnyUser;
		noHeader?: boolean;
	}
	interface PageData {
		user: AnyUser;
		noHeader?: boolean;
	}
	// interface Error {}
	// interface Platform {}
}
