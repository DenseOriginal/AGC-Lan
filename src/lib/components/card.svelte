<div class="card">
	{#if $$slots.header}
		<div class="head">
			<slot name="header" />
		</div>
	{/if}
	<slot name="content" />
</div>

<style>
	.card {
		background-color: var(--card-background);
		-webkit-box-shadow: var(--shadow-basic);
		box-shadow: var(--shadow-basic);
		padding: 32px;
		border-radius: 10px;
		margin-bottom: 32px;
	}

	.card .head {
		border-bottom: 1px solid var(--background-300);
		padding-bottom: 16px;
		margin-bottom: 24px;
	}

	:global(.card > *[slot="content"] > *) {
		line-height: 1.2em;
    	margin: 15px 0 15px;
	}
</style>
