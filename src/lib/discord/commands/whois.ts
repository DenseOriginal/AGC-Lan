import { CommandInteraction, MessageEmbed } from "discord.js";
import { UserModel } from "../../models/user";
import { environment } from "../environment";
import { BetterCommandBuilder } from "../helpers/command.class";
import { allowAdmin, allowSuperAdmin } from "../helpers/permissions";

export const whoIsCommand = new BetterCommandBuilder()
  .setName('whois')
  .addUserOption(option => option
    .setName('bruger')
    .setDescription('Brugeren til at finde information om')
    .setRequired(true))
  .setDescription('Henter navn for en bruger')
  .setDefaultPermission(false)
  .addPermission(allowAdmin)
  .addPermission(allowSuperAdmin)
  .setAction(async (interaction: CommandInteraction) => {
    // Get the mentioned user
    const user = interaction.options.getUser('bruger', true);
    const discordId = user.id;

    // try to find them in MongoDB
    const userDoc = await UserModel.findOne({ discord_id: discordId }).exec();

    // Send a message if they can't be found
    if(!userDoc) return interaction.reply({ ephemeral: true, embeds: [ new MessageEmbed().setTitle('Brugeren er ikke registeret').setColor('#ff5959') ] })

    // Send the info back to the user
    return interaction.reply({
      ephemeral: true,
      embeds: [
        new MessageEmbed()
          .setTitle(`Whois - ${user.username}#${user.discriminator}`)
          .addField('Navn', userDoc.first_name + ' ' + userDoc.last_name, true)
          .addField('Klasse', userDoc.class, true)
          .setColor('#52da52')
      ],
    });
  });