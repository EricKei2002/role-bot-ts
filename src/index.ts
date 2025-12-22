import { Client, GatewayIntentBits } from "discord.js";
import { introAuthHandler } from "./discord/handlers/introAuth.js";
import { env } from "./config/env.js";

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.once("ready", () => console.log(`✅ Logged in as ${client.user?.tag}`));
client.on("messageCreate", introAuthHandler(client));
client.login(env.token);
