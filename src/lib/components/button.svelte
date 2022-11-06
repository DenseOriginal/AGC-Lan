<script lang="ts">
    import Spinner from "./spinner.svelte";
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();
	
	export let color: "main" | "warn" | "alert" = "main";
	export let fullWidth: boolean = false;
	export let loading: boolean = false;
</script>

<button
	class="{color} {fullWidth && 'full'} {loading && 'loading'}"
	{...$$props} on:click={() => !loading && dispatch('click')}
>
	{#if !loading}
		<slot />
	{:else}
		<Spinner size="20px" />
	{/if}


</button>

<style>
	button {
		background-color: var(--background);
		outline: none;
		border: none;
		text-align: center;
		color: var(--color);
		padding: 10px 16px;
		font-weight: 600;
		letter-spacing: 1px;
		border-radius: 4px;
		font-family: "Roboto", sans-serif;
		font-size: 13.3px;
		position: relative;
		display: grid;
		place-items: center;
	}

	button.full {
		width: 100%;
	}

	button.loading {
		padding-block: 8px;
	}

	button:not(:disabled, .loading):hover {
		background-color: var(--hoverBackground);
		color: var(--hoverColor);
	}

	button:not(.loading):disabled:after {
		content: "";
		width: 100%;
		height: 100%;
		position: absolute;
		top: 0;
		left: 0;
		border-radius: 4px;
		background-color: rgba(39, 39, 39, 0.39);
	}

	button:disabled:hover {
		cursor: not-allowed;
	}

	button,
	button.main {
		--background: var(--info-400);
		--color: var(--info-contrast-400);
	}

	button:hover,
	button.main:hover {
		--hoverBackground: var(--info-700);
		--hoverColor: var(--info-contrast-700);
	}

	button.warn {
		--background: var(--warn-400);
		--color: var(--warn-contrast-400);
	}

	button.warn:hover {
		--hoverBackground: var(--warn-700);
		--hoverColor: var(--warn-contrast-700);
	}

	button.alert {
		--background: var(--alert-400);
		--color: var(--alert-contrast-400);
	}

	button.alert:hover {
		--hoverBackground: var(--alert-700);
		--hoverColor: var(--alert-contrast-700);
	}
</style>
