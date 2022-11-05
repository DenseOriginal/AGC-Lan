import { BetterCommandBuilder } from "../helpers/command.class";
import { allowAdmin, allowSuperAdmin } from "../helpers/permissions";

export const sayCommand = new BetterCommandBuilder()
  .setName('say')
  .setDescription('Botten siger en besked')
  .addStringOption(option => option
    .setName('besked')
    .setDescription('Beskeden botton skal sige')
    .setRequired(true))
  .setDefaultMemberPermissions('0')
  .addPermission(allowAdmin)
  .addPermission(allowSuperAdmin)
  .setAction((interaction) => {
    const message = interaction.options.getString('besked');
    if(!message) return;
    interaction.reply({
      ephemeral: true,
      content: 'Din besked er blevet sendt.'
    });

    return interaction.channel?.send(message);
  });