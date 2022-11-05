<script lang="ts">
    import { browser } from "$app/environment";
	import Card from "$lib/components/card.svelte";

	if (browser && location.search.includes('reload=true')) location.href = '/';
</script>

<Card>
	<h2 slot="header">Ingen LAN planlagt</h2>
	<p slot="content">Der er ingen LAN planlagt på nuværende tidspunkt</p>
</Card>

<Card>
	<h2 slot="header">Hvad er AG LAN?</h2>
	<div slot="content">
		<p>
			AG LAN <span class="acronym"
				>(A<span>arhus</span>G<span>ymnasium</span> L<span>AN</span>) er
				navnet på det LAN vi holder på Aarhus Gymnasium Aarhus C, af
				elever, for elever. LAN bliver som regel holdt over en weekend,
				fra fredag aften til søndag middag, men det er tilladt at komme
				og gå som man vil, så længe man er tilmeldt.</span
			>
		</p>

		<p>
			Under <a href="/FAQ">Information</a> kan du finde alle de informationer,
			du har brug for at vide, før du tager til LAN. Dette inkluderer for eksempel
			tid og sted, pakkeliste, hvordan madbestilling foregår, regler for opholdelse
			under LAN, og en FAQ.
		</p>
		<p>
			Under <a href="/lan/tilmeld">Tilmelding</a> kan du melde dig til næste
			LAN, og reservere plads. Vi regner med at alle, der kommer, melder sig
			til.
		</p>
		<p>
			På vores <a href="https://discord.gg/3DJaNFY">Discord</a> server kan
			du melde dig til det kommende LAN's turneringer. Her kan du også se holdenes
			placering under og efter turneringer, og hvilke præmier de forskellige
			turneringer har.
		</p>
	</div>
</Card>

<Card>
	<h2 slot="header">Regler</h2>
	<div slot="content">
		<p>
			Vi har nogle få, men vigtige, regler, som vi gerne vil have at alle
			overholder af sikkerhedsmæssige årsager, og for at alle kan få en
			god oplevelse til LAN.
		</p>
		<ul>
			<li>
				<b>Du må ikke komme beruset, eller indtage alkohol</b>, til
				nogen af LANene. Hvis der er påvirkede mennesker til LAN, kan
				LAN risikere at blive lukket for evigt.
			</li>
			<li>
				<b>Når du har brugt køkkenet, skal du huske at rydde op</b> og gøre
				rent de steder hvor du har været, og de ting du har brugt.
			</li>
			<li>
				<b
					>Der må ikke stå tasker eller andet baggage ved bordene, da
					det spærrer brandvejene.</b
				> Al baggage skal i stedet stilles op på trappen, eller i andre afmarkerede
				baggageområder.
			</li>
			<li>
				<b
					>Der må ikke stå drikke- eller spisevarer i nærheden af
					El-tavlerne (de store strømfordelere)</b
				>.
			</li>
			<li>
				<b
					>For at undgå kortslutning, må du ikke sætte højspændigs
					køkkenudstyr (som køleskabe) til strømstikket hvor du
					sidder.</b
				>
				Vi har et dedikeret køkkenområde, der er sat op til at klare højere
				spænding.
			</li>
			<li>
				<b
					>Der må ikke medbringes netværksudstyr som routere og
					access-points, og du må ikke hoste hotspots og andet uden
					tilladelse.</b
				> Når du ankommer skal du også sikre dig at din computer ikke er
				sat op til at dele dit netværk igennem lan-kabel. Dette kan nemlig
				forårsage problemer.
			</li>
			<li>
				<b>Husk at rydde op løbende under LAN,</b> og smid dine pantflasker
				i de afmarkerede pantspande.
			</li>
			<li>
				Vi forbeholder os retten til at fjerne alt upassende data fra en
				brugers profil.
			</li>
		</ul>
	</div>
</Card>

<style>
	.acronym > span {
		font-size: 80%;
		top: 2px;
		position: relative;
		margin-left: 1px;
		color: var(--muted-text);
	}
</style>
