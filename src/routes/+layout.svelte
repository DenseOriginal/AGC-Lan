<script lang="ts">
	import Nav from "$lib/components/nav.svelte";
	import Footer from "$lib/components/footer.svelte";
    import type { PageData } from "./$types";

	export let data: PageData;
</script>

<div class="background-image" />

<Nav user={data.user} />

<main class="page">
	<div class="inner">
		<slot />
	</div>
</main>

<Footer />

<!-- {{!-- This is so that we can offset the footer to account for the height of the bottom fixed navbar
	It only has height if the screen is under a certian side, see more in partials/header --}} -->
<div id="footer-offset" />

<style>
	.page {
		min-height: 100%;
		height: fit-content;
	}

	.page > .inner {
		width: 100%;
		padding: 16px;
		height: 100%;
	}

	.background-image {
		position: fixed;
		z-index: -10000;
		width: 100%;
		height: 100%;
		background-color: var(--background-50);
		background-image: var(--background-image);
		background-position: center; /* Center the image */
		background-repeat: no-repeat; /* Do not repeat the image */
		background-size: cover; /* Resize the background image to cover the entire container */
	}
</style>
