<script lang="ts">
	import { page } from "$app/stores";
    import CardNoPadding from "$lib/components/cardNoPadding.svelte";
    import ClassPicker from "$lib/components/classPicker.svelte";
	import type { User } from "src/types/user";

	let user: User = $page.data.user;
	let isEditing = false;

	$: disabled = !isEditing;

	function editProfile() {
		isEditing = true;
	}
</script>

<h1>Din profil</h1>
<br />
<CardNoPadding>
	<div slot="header" class="space-between">
		<h3>Personlig information</h3>
		<!-- <a class="edit-button" href="#edit" on:click={editProfile}
			>Edit <i class="far fa-edit edit-logo" /></a
		> -->
	</div>
	<form action="/profile" method="POST" slot="content">
		<div class="row">
			<p class="title">Fornavn:</p>
			<input
				type="text"
				name="first_name"
				{disabled}
				value={user.first_name}
			/>
		</div>
		<div class="row">
			<p class="title">Efternavn:</p>
			<input
				type="text"
				name="last_name"
				{disabled}
				value={user.last_name}
			/>
		</div>
		<div class="row">
			<p class="title">Stam klasse:</p>
			<input
				type="text"
				name="class"
				{disabled}
				value={user.class}
				list="classes"
				autocomplete="off"
			/>
		</div>
		<div class="row">
			<p class="title">Email:</p>
			{user.email}
		</div>
		<div class="row">
			<p class="title">Brugernavn:</p>
			{user.username}
		</div>
		<!-- <div class="row" id="edit-button-row">
		<button type="reset" class="warn" onclick="stopEditing()">Annuller</button>
		<button type="submit" onclick="gtag('event', 'updare_profile', { event_category: 'Profile', transport_type: 'beacon'}">Opdater</button>
	  </div> -->

	  <ClassPicker />
	</form>
</CardNoPadding>

<style>
	.space-between {
		display: flex;
		justify-content: space-between;
	}

	.row {
		width: 100%;
		padding: 12px 32px !important;
		margin: 0 !important;
		display: flex;
		justify-content: flex-start;
	}

	.row > .title {
		min-width: 150px !important;
		color: var(--muted-text);
	}

	.row:nth-child(odd) {
		background-color: var(--background-200);
	}

	form input {
		background-color: transparent;
		border: none;
		border-bottom: var(--background-400) 2px solid;
		border-radius: 3px;
		outline: none;
		font-size: 1rem;
		padding-bottom: 2px;
		padding-left: 4px;
	}

	form input:focus,
	form input:active {
		border-color: var(--active);
	}

	form input:disabled {
		border: none;
		color: unset;
	}

	form {
		padding: 0;
		padding-bottom: 32px;
	}
</style>
