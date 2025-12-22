import { Client, EmbedBuilder, Message } from "discord.js";
import { INTRO_TEMPLATE_HINT, validateIntro } from "./rules.js";
import { env } from "../../config/env.js";
import { sendLogEmbed } from "../../services/logger.js";

const lastHandled = new Map<string, number>();

const nowJST = () => new Date().toLocaleString("ja-JP", { timeZone: "Asia/Tokyo" });

async function replyAndAutoDelete(message: Message, content: string, ms: number) {
  try {
    const reply = await message.reply(content);
    setTimeout(() => {
      reply.delete().catch(() => {});
    }, ms);
  } catch {}
}

export function createIntroHandler(client: Client) {
  return async (message: Message) => {
    if (message.author.bot || !message.guild) return;
    if (message.channel.id !== env.introChannelId) return;

    const key = `${message.guild.id}:${message.author.id}`;
    const now = Date.now();
    const last = lastHandled.get(key) ?? 0;
    if (now - last < env.cooldownMs) return;
    lastHandled.set(key, now);

    const guild = message.guild;
    const member = await guild.members.fetch(message.author.id);
    const role = guild.roles.cache.get(env.memberRoleId);
    if (!role) {
      await sendLogEmbed(
        client,
        new EmbedBuilder()
          .setTitle("🔴 認証失敗（ロール未設定）")
          .setDescription("環境変数 MEMBER_ROLE_ID の設定を確認してください。")
          .addFields(
            { name: "ユーザー", value: `${member.user.tag} (<@${member.id}>)` },
            { name: "チャンネル", value: `<#${message.channel.id}>` }
          )
          .setFooter({ text: `時刻: ${nowJST()}` })
      );
      return;
    }

    if (member.roles.cache.has(role.id)) return;

    const validation = validateIntro(message.content, env.minChars);
    if (!validation.ok) {
      const errorList = validation.errors.map((e) => `• ${e}`).join("\n");

      if (validation.reason === "NOT_TEMPLATE" && validation.missingFields?.length) {
        await message.react("❌").catch(() => {});
        const missingText = validation.missingFields.map((f) => `・${f}`).join("\n");
        await replyAndAutoDelete(
          message,
          [
            `${message.author} テンプレの必須項目が不足してるよ！`,
            "",
            "不足項目:",
            missingText,
            "",
            "テンプレ例:",
            "【名前】",
            "（呼ばれたい名前）",
            "",
            "【目的】",
            "（参加した理由）",
            "",
            "【一言】",
            "（自由欄）",
          ].join("\n"),
          10_000
        );
      } else {
        const embed = new EmbedBuilder()
          .setTitle("❌ 自己紹介の形式が合ってないよ")
          .setDescription("下のテンプレをコピペして書いてね（【性別】【年齢】は任意）👇")
          .addFields(
            { name: "不足している項目", value: errorList },
            { name: "テンプレ", value: INTRO_TEMPLATE_HINT }
          );
        await message.reply({
          content: `${message.author} テンプレを確認してもう一度送ってね！`,
          embeds: [embed],
        });
      }

      await sendLogEmbed(
        client,
        new EmbedBuilder()
          .setTitle("🟡 認証失敗（バリデーションNG）")
          .setDescription(errorList)
          .addFields({ name: "ユーザー", value: `${member.user.tag} (<@${member.id}>)` })
          .setFooter({ text: `時刻: ${nowJST()}` })
      );
      return;
    }

    try {
      await member.roles.add(role);
    } catch (error) {
      const errEmbed = new EmbedBuilder()
        .setTitle("🔴 ロール付与失敗")
        .setDescription("BOT権限（Manage Roles / ロール位置）やロールIDを確認してください。")
        .addFields(
          { name: "ユーザー", value: `${member.user.tag} (<@${member.id}>)` },
          { name: "付与ロール", value: `<@&${role.id}>` }
        )
        .setFooter({ text: `時刻: ${nowJST()}` });

      await sendLogEmbed(client, errEmbed);

      try {
        await message.reply({
          embeds: [
            new EmbedBuilder()
              .setTitle("❌ 認証に失敗しました")
              .setDescription("運営側の設定（BOT権限）に問題がある可能性があります。しばらく待ってからもう一度お試しください。"),
          ],
        });
      } catch {}

      console.error("roles.add failed:", error);
      return;
    }

    try {
      await message.react("✅");
    } catch {}

    const successEmbed = new EmbedBuilder()
      .setTitle("✅ 認証完了！")
      .setDescription("自己紹介ありがとう！認証ロールを付与しました 🎉")
      .addFields(
        { name: "ロール", value: `<@&${role.id}>`, inline: true },
        { name: "ユーザー", value: `<@${member.id}>`, inline: true }
      );

    await message.reply({ embeds: [successEmbed] });

    await sendLogEmbed(
      client,
      new EmbedBuilder()
        .setTitle("🟢 認証成功")
        .addFields(
          { name: "ユーザー", value: `${member.user.tag} (<@${member.id}>)` },
          { name: "チャンネル", value: `<#${message.channel.id}>`, inline: true },
          { name: "付与ロール", value: `<@&${role.id}>`, inline: true },
          { name: "メッセージID", value: message.id }
        )
        .setFooter({ text: `時刻: ${nowJST()}` })
    );
  };
}
