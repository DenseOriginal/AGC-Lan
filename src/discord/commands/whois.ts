import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, MessageEmbed, User } from "discord.js";
import { UserModel } from "../../models/user";
import { IDiscordCommand } from "../interfaces";

export const whoIsCommand: IDiscordCommand = {
  data: new SlashCommandBuilder()
    .setName('whois')
    .addUserOption(option => option
      .setName('bruger')
      .setDescription('Brugeren til at finde information om')
      .setRequired(true))
    .setDescription('Henter navn for en bruger'),
  async execute(interaction: CommandInteraction) {
    const user = interaction.options.getUser('bruger', true);
    const discordId = user.id;
    const userDoc = await UserModel.findOne({ discord_id: discordId }).exec();
    if(!userDoc) return interaction.reply({ ephemeral: true, embeds: [ new MessageEmbed().setTitle('Brugeren er ikke registeret').setColor('#ff5959') ] })

    return interaction.reply({
      ephemeral: true,
      embeds: [
        new MessageEmbed()
          .setTitle(`Whois - ${user.username}#${user.discriminator}`)
          .addField('Navn', userDoc.first_name + ' ' + userDoc.last_name, true)
          .addField('Klasse', userDoc.class, true)
          .setColor('#59ff59')
      ],
    });
  }
}