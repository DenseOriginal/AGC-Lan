import { Intents, Client } from "discord.js";
import "./listeners/new-user";

export const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_MEMBERS,
  ],
});

client.on("ready", async () => {
  console.log(">> Bot started");
});

export async function run() {
  client.login(process.env.BOT_TOKEN as string || "");
}