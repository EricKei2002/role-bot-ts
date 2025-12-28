import { Client, Events, GatewayIntentBits } from "discord.js";
import { introAuthHandler, introAuthWelcomeHandler } from "./discord/handlers/introAuth";
import { env } from "./config/env";

const client = new Client({
    intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    ],
});

client.once(Events.ClientReady, () => console.log(`✅ Logged in as ${client.user?.tag}`));
client.on(Events.MessageCreate, introAuthHandler(client));
introAuthWelcomeHandler(client);
client.login(env.token);
