<script lang="ts">
	import Card from "$lib/components/card.svelte";
    import ClassPicker from "$lib/components/classPicker.svelte";
	import Input from "$lib/components/input.svelte";
	import { writable } from "svelte/store";

	const form = writable({
		firstname: "",
		lastname: "",
		class: "",
		error: ''
	});

	const required = (err: string) => (val: string) =>
		!val ? err : undefined;
</script>

<div class="setup">
	<Card>
		<div class="setup-card" slot="content">
			<form action="/profile/setup" id="setupForm" method="post">
				<Input
					bind:value={$form.firstname}
					id="firstname"
					placeholder="Fornanvn"
					validators={[required('Venligts udfyld fornavn')]}
				/>
				<Input
					bind:value={$form.lastname}
					bind:error={$form.error}
					id="lastname"
					placeholder="Efternavn"
					validators={[required('Venligts udfyld efternavn')]}
				/>
				<Input
					bind:value={$form.class}
					id="class"
					placeholder="Stam klasse (f. eks. 20HTXCR)"
					list="classes"
				/>

				<button type="button" on:click={() => console.log($form.error)}>Opret</button>

				<ClassPicker />
			</form>

			<div class="description">
				<p>
					For at færdiggøre din profil mangler vi lige lidt mere
					information
				</p>
				<p>
					Når du klikker opret konto accepterer du vilkåerne i vores <a
						href="/policy"
						target="_blank">privatlivspolitik</a
					>
				</p>
			</div>
		</div>
	</Card>
</div>

<style>
	:global(.page > .inner) {
		display: grid;
		place-items: center;
	}

	.setup {
		width: min(95%, 500px);
		height: 90vh;
		display: grid;
		place-items: center;
	}

	.setup-card {
		display: flex;
		justify-content: space-between;
	}

	.setup-card > .description {
		padding-left: 32px;
		border-left: var(--border-muted) 2px solid;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		width: 40%;
	}

	.setup-card > .description > p {
		color: var(--muted-text);
		margin-bottom: 4px;
	}

	.setup-card > .description > p > a {
		color: var(--link-color);
	}

	.setup-card > form {
		margin-right: 32px;

		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		align-items: flex-start;
		width: 59%;
	}

	@media only screen and (max-width: 630px) {
		.setup {
			width: min(100%, 360px);
		}

		.setup-card {
			flex-direction: column-reverse;
			align-items: center;
		}

		.setup-card > .description {
			margin-bottom: 32px;
			border: none;
			border-bottom: var(--border-muted) 2px solid;
			padding-left: 0;
			padding-bottom: 16px;
			width: 100%;
		}

		.setup-card > form {
			width: min(100%, 300px);
			margin-right: 0;
		}
	}
</style>
