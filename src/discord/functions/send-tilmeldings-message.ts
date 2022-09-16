import { MessageEmbed } from "discord.js";
import { ILAN } from "../../models/lan";
import { client } from "../client";

export async function sendTilmeldingsMessage(
  lan: ILAN,
  tilmeldingId: string,
  discordUserId: string,
) {
  // Send a private DM to the user, congratulating them on their tilmelding
  // And sends a QR code to the user, with the tilmelding id
  
  try {
    const user = await client.users.fetch(discordUserId);
    const embed = new MessageEmbed()
      .setDescription(`:tada: Du er nu tilmeldt til **${lan.name}**, vi glæder os til at se dig`)
      .setImage(`https://api.qrserver.com/v1/create-qr-code/?size=150x150&margin=6&data=${tilmeldingId}`)
      .setColor('#52da52');

    await user.send({ embeds: [embed] });
  } catch (error) {
    console.error(error);
  }
}