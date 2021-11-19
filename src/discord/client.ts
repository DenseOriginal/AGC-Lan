import { Intents } from "discord.js";
import { Client } from "discordx";

const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_MEMBERS,
  ],
  botGuilds: [(client) => client.guilds.cache.map((guild) => guild.id)],
  silent: false,
});

client.on("ready", async () => {
  console.log(">> Bot started");

  // to create/update/delete discord application commands
  await client.initApplicationCommands();
  await client.initApplicationPermissions();
});

export async function run() {
  client.login(process.env.BOT_TOKEN as string || "");
}