<script lang="ts">
	import type { PageData } from ".svelte-kit/types/src/routes/$types";
	import type { User } from "src/types/user";

	export let user: User | undefined;
	let smallNavOpen = false;

	function isUser(user: any): user is User {
		return !!user;
	}

	const imgUrl = user?.avatar
		? `https://cdn.discordapp.com/avatars/${user?.id}/${user?.avatar}.png`
		: "https://cdn.discordapp.com/embed/avatars/3.png";
</script>

<header>
	<div class="logo">
		<a href="/">
			<img
				class="logo-img"
				height="28"
				src="/images/logo/pill.png"
				alt="AG Lan logo"
			/>
		</a>
	</div>

	<nav class="large">
		<a href="/faq">Information</a>
		<a href="/kalender">Kalender</a>
		<a href="/lan/list" id="lan">Lan</a>

		<!-- {{#if (isStaff user)}} -->
		<a href="/staff">Staff</a>
		<!-- {{/if}} -->

		{#if isUser(user)}
			<div class="spacer" />
			<div class="dropdown-container">
				<a class="user" href="/profile">
					<img
						class="avatar"
						height="28"
						src={imgUrl}
						alt="Profile"
					/>
					<p><span>{user.username}</span></p>
				</a>

				<div class="dropdown">
					<a href="/api/signout" class="flex-space-between"
						>Log ud <i class="fas fa-sign-out-alt" /></a
					>
				</div>
			</div>
		{:else}
			<div class="spacer" />
			<a class="user" href="/login">Login</a>
		{/if}
	</nav>

	<nav class="small">
		<input type="checkbox" name="is-open" id="is-open" />
		<div class="container {smallNavOpen && 'is-open'}">
			<div class="inner">
				<a on:click={() => smallNavOpen = false} href="/faq">Information</a>
				<a on:click={() => smallNavOpen = false} href="/kalender">Kalender</a>
				<a on:click={() => smallNavOpen = false} href="/lan/list">Lan</a>

				<!-- {{#if (isStaff user)}} -->
				<a on:click={() => smallNavOpen = false} href="/staff">Staff</a>
				<!-- {{/if}} -->

				<div class="spacer" />

				{#if isUser(user)}
					<a class="user" on:click={() => smallNavOpen = false} href="/profile">
						<img
							class="avatar"
							height="28"
							src={imgUrl}
							alt="Profile"
						/>
						<p>{user.username}</p>
					</a>
				{:else}
					<a class="user" on:click={() => smallNavOpen = false} href="/login">Login</a>
				{/if}

				<button class="close" on:click={() => (smallNavOpen = false)}
					><i class="fas fa-chevron-up" />
				</button>
			</div>
		</div>

		<button class="open-nav" on:click={() => (smallNavOpen = true)}>
			<span>Menu</span>
			<i class="fas fa-bars" />
		</button>
	</nav>
</header>

<style>
	.dropdown-container {
      position: relative;
      height: 100%;
    }

    .dropdown-container .dropdown {
      visibility: hidden;
      opacity: 0;
      position: absolute;
      list-style-type: none;
      width: 150%;
      top: 48px;
      right: 0;
      background-color: var(--background-200);
      transition: var(--fast-transition);
      display: flex;
      flex-direction: column;
    }

    .dropdown-container:hover .dropdown {
      visibility: unset;
      opacity: 1;
    }

    .dropdown-container .dropdown a {
      width: 100%;
      text-align: center;
      height: 42px;
	  display: flex;
	  justify-content: space-between;
    }

	header {
		background-color: var(--background-100);
		display: flex;
		justify-content: flex-start;
		align-items: center;
		height: 48px;
	}

	header > .logo {
		height: 28px;
		padding: 0 16px;
	}

	header > .logo img {
		height: 100%;
	}

	header a {
		text-decoration: none;
	}

	nav.large {
		flex-grow: 1;
		display: flex;
		justify-content: flex-end;
		align-items: center;
		height: 100%;
	}

	nav .spacer {
		content: "";
		height: 55%;
		width: 1.5px;
		margin: auto 4px;
		background-color: var(--background-400);
	}

	nav a {
		display: flex;
		align-items: center;
		padding: 0 16px;
		height: 100%;
		text-decoration: none;
		color: var(--primary-text);
	}

	nav a:hover {
		cursor: pointer;
		background-color: var(--background-300);
		text-decoration: none;
	}

	nav .user {
		display: flex;
		align-items: center;
	}

	nav.large .user {
		width: 140px;
		overflow: hidden;
	}

	nav.large .user span {
		display: block;
		width: unset;
	}

	.user > .avatar {
		height: 28px;
		width: 28px;
		border-radius: 50%;
		margin-right: 8px;
	}

	nav.small {
		display: none;
		flex-grow: 1;
		justify-content: flex-end;
		align-items: center;
		height: 100%;
	}

	nav.small > #is-open {
		display: none;
	}

	nav.small button.open-nav {
		font-size: 26px;
		display: flex;
		align-items: center;
		background-color: transparent;
		color: var(--primary-text);
	}

	nav.small .open-nav span {
		margin-right: 8px;
		font-size: 18px;
		font-weight: 500;
	}

	nav.small > .container {
		position: fixed;
		z-index: 10;
		top: 0;
		left: 0;
		overflow: hidden;
		height: 0;
		width: 100%;
		background-color: var(--background-100);
		transition: var(--fast-transition);
	}
	nav.small > .container > .inner {
		height: 100%;
		width: 100%;
		padding: 16px;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}

	nav.small > .container button.close {
		position: absolute;
		bottom: 16px;
		right: 16px;
		padding: 16px;
		background-color: var(--card-background);
		-webkit-box-shadow: var(--shadow-basic);
		box-shadow: var(--shadow-basic);
		border-radius: 8px;
		color: var(--primary-text);
	}

	nav.small > .container.is-open {
		height: 100%;
	}

	nav.small a:not(.open-nav) {
		width: 100%;
		height: fit-content;
		padding: 12px 0;
		font-size: 24px;
		font-weight: 500;
		color: var(--muted-text);
		display: flex;
		justify-content: center;
	}

	nav.small .spacer {
		height: 1.5px;
		width: 60%;
		margin: 0;
		margin-top: 32px;
		margin-bottom: 16px;
	}

	@media only screen and (max-width: 610px) {
		nav.large #lan {
			display: none;
		}
	}

	@media only screen and (max-width: 560px) {
		nav.small {
			display: flex;
		}

		nav.large {
			display: none;
		}

		header {
			position: fixed;
			bottom: 0;
			width: 100%;
			z-index: 2;
		}

		:global(#footer-offset) {
			content: "";
			width: 100%;
			height: 48px;
		}
	}
</style>
