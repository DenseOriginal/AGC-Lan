<script lang="ts">
	export let size: string = '50px';
</script>

<div id="loading" style:width={size} style:height={size} />

<style>
	#loading {
		display: inline-block;
		border: 2px solid rgba(255, 255, 255, 0.3);
		border-radius: 50%;
		border-top-color: #fff;
		animation: spin 1s ease-in-out infinite;
		-webkit-animation: spin 1s ease-in-out infinite;
	}

	@keyframes spin {
		to {
			-webkit-transform: rotate(360deg);
		}
	}
	@-webkit-keyframes spin {
		to {
			-webkit-transform: rotate(360deg);
		}
	}
</style>
