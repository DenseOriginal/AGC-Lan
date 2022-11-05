import { getNextLan } from "$lib/helper/lan";
import { MessageEmbed } from "discord.js";
import { LanUserModel } from "../../models/lan-user";
import { UserModel } from "../../models/user";
import { BetterCommandBuilder } from "../helpers/command.class";

export const getSeatCommand = new BetterCommandBuilder()
	.setName('getseat')
	.setDescription('Find reserverede plads for en bruger til nuværendende lan')
	.addUserOption(option => option
		.setName('bruger')
		.setDescription('Brugeren til at finde information om')
		.setRequired(true))
	.setDefaultMemberPermissions('0')
	.setAction(async (interaction) => {
		// Get the mentioned user
		const user = interaction.options.getUser('bruger', true);
		const discordId = user.id;

		// Get next lan
		const nextLan = await getNextLan();
		if (!nextLan) return interaction.reply({ ephemeral: true, embeds: [new MessageEmbed().setTitle('Kan ikke finde noget lan').setColor('#ff5959')] })

		// try to find them in MongoDB
		const userDoc = await UserModel.findOne({ discord_id: discordId }).exec();
		if (!userDoc) return interaction.reply({ ephemeral: true, embeds: [new MessageEmbed().setTitle('Brugeren er ikke registeret på hjemmesiden').setColor('#ff5959')] })

		// Try to find the tilmeldt user
		const lanUser = await LanUserModel.findOne({ lan: nextLan.id, user: userDoc.id }).exec();
		if (!lanUser) return interaction.reply({ ephemeral: true, embeds: [new MessageEmbed().setTitle('Denne bruger har ikke reserveret en plads').setColor('#ff5959')] })

		// Send the info back to the user
		return interaction.reply({
			ephemeral: true,
			embeds: [
				new MessageEmbed()
					.setTitle(`Get seat - ${user.username}#${user.discriminator}`)
					.addFields([
						{name: 'Lan', value: nextLan.name, inline: false},
						{name: 'Reserveret plads', value: lanUser.seat, inline: false},
					])
					.setColor('#52da52')
			],
		});
	});