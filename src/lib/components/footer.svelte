<script lang="ts">
	import { browser } from "$app/environment";

	function changeTheme() {
		// Get the current theme, if nothing is set then use "light"
		// Then use the current theme to determine the new theme, by swapping between "dark" and "light"
		const newTheme = theme == "light" ? "dark" : "light";
		localStorage.setItem("color_theme", newTheme);

		// Apply the theme
		document.documentElement.setAttribute("data-theme", newTheme);
		theme = newTheme;
	}

	// Onload change to the theme stored in localStorage, if nothing is there use "light"
	let theme: "light" | "dark" =
		(browser && (localStorage.getItem("color_theme") as any)) || "light";

	// Apply the stored theme
	browser && document.documentElement.setAttribute("data-theme", theme);

	const year = new Date().getFullYear();
</script>

<footer>
	<div class="container-footer">
		<span class="copyright noselect red-gradient"
			>Copyright &copy; <span id="copyright-year">{year}</span> AGLan</span
		>
		<div class="rest">
			<!-- Theme toggle -->
			<i class="far fa-sun" />
			<label class="switch color-switch">
				<input
					type="checkbox"
					value={theme == "dark"}
					on:click={changeTheme}
				/>
				<span class="slider round" />
			</label>
			<i class="far fa-moon" />
		</div>
	</div>
</footer>

<svelte:head>
	<link rel="stylesheet" href="/styles/switch.css" />
</svelte:head>

<style>
	footer {
		display: flex;
		justify-content: flex-start;
		background: var(--logo-red);
		color: white;
	}

	footer > .container-footer {
		display: flex;
		justify-content: flex-start;
		align-items: center;
		width: 100%;
	}

	footer > .container-footer > .copyright {
		font-weight: 100;
		background: linear-gradient(
			70deg,
			var(--logo-blue) 93%,
			var(--logo-red) 93%
		);
		padding: 8px 16px;
		padding-right: 32px;
		height: 100%;
	}

	footer > .container-footer > .rest {
		padding: 8px 16px;
		flex-grow: 1;
		display: flex;
		justify-content: flex-end;
		align-items: center;
	}

	footer > .container-footer > .rest > .switch {
		margin: 0 8px;
	}
</style>
