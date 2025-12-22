import { Client, GatewayIntentBits } from "discord.js";
import { createIntroHandler } from "./features/introAuth/handler.js";
import { env } from "./env.js";

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.once("ready", () => console.log(`✅ Logged in as ${client.user?.tag}`));
client.on("messageCreate", createIntroHandler(client));
client.login(env.token);
