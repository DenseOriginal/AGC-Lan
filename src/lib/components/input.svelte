<script lang="ts">
	type Validator = (val: string) => string | undefined;

	export let value = "";
	export let type: "text" | "number" = "text";
	export let placeholder: string = "";
	export let id: string;
	export let validators: Validator[] = [];
	export let error = "";

	let touched: boolean = false;

	function typeAction(node: HTMLInputElement) {
		node.type = type;
	}

	function hasErrors(value: string) {
		if (!touched) return;

		for(const validator of validators) {
			const err = validator(value);
			if (err) {
				return error = err;
			}
		}

		error = "";
	}
</script>

<div class="input">
	<input
		use:typeAction
		name={id}
		{id}
		bind:value
		{placeholder}
		autocomplete="off"
		on:input={(e) => hasErrors(e.currentTarget.value)}
		on:focus={() => touched = true}
		on:blur={() => hasErrors(value)}
		{...$$props}
	/>

	{#if error}
		<p class="error">{error}</p>
	{/if}
</div>

<style>
	.input > input {
		margin-bottom: 2px;
		width: 100%;
	}

	.input {
		margin-bottom: 12px;
		width: 100%;
	}

	.input > .error {
		margin-left: 8px;
		color: var(--warn-400);
	}

	.input input {
		color: var(--background-contrast-200);
		padding: 12px 16px;
		padding-left: 8px;
		border: none;
		background-color: var(--background-200);
		border-bottom: var(--background-400) 2px solid;
		outline: none;
		border-radius: 3px;
		font-size: 16px;

		transition: var(--fast-transition);
	}

	.input input::placeholder {
		color: var(--muted-text);
	}

	.input input:active,
	.input input:focus {
		border-color: var(--info-400);
	}
</style>
