import { Client, EmbedBuilder, TextChannel } from "discord.js";
import { env } from "../env.js";

export async function sendLogEmbed(client: Client, embed: EmbedBuilder) {
  try {
    const ch = await client.channels.fetch(env.logChannelId).catch(() => null);
    if (!ch || !ch.isTextBased()) return;
    await (ch as TextChannel).send({ embeds: [embed] });
  } catch (error) {
    console.error("logEmbed failed:", error);
  }
}
