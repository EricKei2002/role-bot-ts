import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  Client,
  EmbedBuilder,
  Events,
  Message,
  ModalBuilder,
  TextChannel,
  TextInputBuilder,
  TextInputStyle,
} from "discord.js";
import { INTRO_TEMPLATE_HINT, extractIntroName, validateIntro } from "./rules";
import { env } from "../../config/env";
import { sendLogEmbed } from "../../services/logger";

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

    const introName = extractIntroName(message.content);
    const successMessage = introName
      ? `${introName}さん。自己紹介ありがとう！認証ロールを付与しました 🎉`
      : "自己紹介ありがとう！認証ロールを付与しました 🎉";

    const successEmbed = new EmbedBuilder()
      .setTitle("✅ 認証完了！")
      .setDescription(successMessage)
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

export function registerIntroWelcomeHandler(client: Client) {
  client.on(Events.GuildMemberAdd, async (member) => {
    if (member.user.bot) return;
    await ensureIntroButtonMessage(client);
  });
}

const INTRO_BUTTON_CUSTOM_ID = "introAuth:openModal";
const INTRO_MODAL_CUSTOM_ID = "introAuth:submit";

function buildIntroText(fields: {
  name: string;
  age?: string;
  gender?: string;
  purpose: string;
  one: string;
}) {
  return [
    "【名前】",
    fields.name,
    "",
    "【年齢】（任意）",
    fields.age ?? "",
    "",
    "【性別】（任意）",
    fields.gender ?? "",
    "",
    "【目的】",
    fields.purpose,
    "",
    "【一言】",
    fields.one,
  ].join("\n");
}

async function ensureIntroButtonMessage(client: Client) {
  const ch = await client.channels.fetch(env.introChannelId).catch(() => null);
  if (!ch || !ch.isTextBased()) return;
  const channel = ch as TextChannel;

  const recent = await channel.messages.fetch({ limit: 50 }).catch(() => null);
  const existing = recent?.find(
    (m) =>
      m.author.id === client.user?.id &&
      m.content.includes("自己紹介を入力してください。")
  );
  if (existing) return;

  const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder()
      .setCustomId(INTRO_BUTTON_CUSTOM_ID)
      .setLabel("自己紹介を書く")
      .setStyle(ButtonStyle.Primary)
  );

  await channel.send({
    content: "ボタンを押して自己紹介を入力してください。",
    components: [row],
  });
}

export function registerIntroModalHandlers(client: Client) {
  client.once(Events.ClientReady, async () => {
    await ensureIntroButtonMessage(client);
  });

  client.on(Events.InteractionCreate, async (interaction) => {
    if (interaction.isButton() && interaction.customId === INTRO_BUTTON_CUSTOM_ID) {
      const modal = new ModalBuilder()
        .setCustomId(INTRO_MODAL_CUSTOM_ID)
        .setTitle("自己紹介フォーム");

      const nameInput = new TextInputBuilder()
        .setCustomId("name")
        .setLabel("名前（呼ばれたい名前）")
        .setStyle(TextInputStyle.Short)
        .setRequired(true);

      const ageInput = new TextInputBuilder()
        .setCustomId("age")
        .setLabel("年齢（任意）")
        .setStyle(TextInputStyle.Short)
        .setRequired(false);

      const genderInput = new TextInputBuilder()
        .setCustomId("gender")
        .setLabel("性別（任意）")
        .setStyle(TextInputStyle.Short)
        .setRequired(false);

      const purposeInput = new TextInputBuilder()
        .setCustomId("purpose")
        .setLabel("参加目的")
        .setStyle(TextInputStyle.Paragraph)
        .setRequired(true);

      const oneInput = new TextInputBuilder()
        .setCustomId("one")
        .setLabel("一言")
        .setStyle(TextInputStyle.Paragraph)
        .setRequired(true);

      modal.addComponents(
        new ActionRowBuilder<TextInputBuilder>().addComponents(nameInput),
        new ActionRowBuilder<TextInputBuilder>().addComponents(ageInput),
        new ActionRowBuilder<TextInputBuilder>().addComponents(genderInput),
        new ActionRowBuilder<TextInputBuilder>().addComponents(purposeInput),
        new ActionRowBuilder<TextInputBuilder>().addComponents(oneInput)
      );

      await interaction.showModal(modal);
      return;
    }

    if (interaction.isModalSubmit() && interaction.customId === INTRO_MODAL_CUSTOM_ID) {
      if (!interaction.inGuild() || !interaction.member || !interaction.guild) {
        await interaction.reply({ content: "サーバー内で実行してください。", ephemeral: true });
        return;
      }

      const name = interaction.fields.getTextInputValue("name").trim();
      const age = interaction.fields.getTextInputValue("age").trim();
      const gender = interaction.fields.getTextInputValue("gender").trim();
      const purpose = interaction.fields.getTextInputValue("purpose").trim();
      const one = interaction.fields.getTextInputValue("one").trim();

      const introText = buildIntroText({
        name,
        age: age || undefined,
        gender: gender || undefined,
        purpose,
        one,
      });

      const validation = validateIntro(introText, env.minChars);
      if (!validation.ok) {
        const missing = validation.missingFields?.join(" / ") ?? "";
        await interaction.reply({
          content: `必須項目が不足しています: ${missing || "不明"}`,
          ephemeral: true,
        });
        return;
      }

      const guild = interaction.guild;
      const member = await guild.members.fetch(interaction.user.id);
      const role = guild.roles.cache.get(env.memberRoleId);
      if (!role) {
        await interaction.reply({ content: "認証ロールが設定されていません。", ephemeral: true });
        return;
      }

      if (!member.roles.cache.has(role.id)) {
        try {
          await member.roles.add(role);
        } catch (error) {
          await interaction.reply({
            content: "ロール付与に失敗しました。運営に確認してください。",
            ephemeral: true,
          });
          await sendLogEmbed(
            client,
            new EmbedBuilder()
              .setTitle("🔴 ロール付与失敗（モーダル）")
              .setDescription("BOT権限（Manage Roles / ロール位置）やロールIDを確認してください。")
              .addFields(
                { name: "ユーザー", value: `${member.user.tag} (<@${member.id}>)` },
                { name: "付与ロール", value: `<@&${role.id}>` }
              )
              .setFooter({ text: `時刻: ${nowJST()}` })
          );
          return;
        }
      }

      const ch = await client.channels.fetch(env.introChannelId).catch(() => null);
      if (ch && ch.isTextBased()) {
        await (ch as TextChannel).send({
          content: `<@${member.id}>`,
          embeds: [
            new EmbedBuilder()
              .setTitle("🙌 自己紹介")
              .setDescription(introText),
          ],
        });
      }

      const replyMessage = name
        ? `${name}さん。自己紹介ありがとう！認証完了です！`
        : "自己紹介ありがとう！認証完了です！";

      await interaction.reply({
        content: replyMessage,
        ephemeral: true,
      });

      await sendLogEmbed(
        client,
        new EmbedBuilder()
          .setTitle("🟢 認証成功（モーダル）")
          .addFields(
            { name: "ユーザー", value: `${member.user.tag} (<@${member.id}>)` },
            { name: "チャンネル", value: `<#${env.introChannelId}>`, inline: true },
            { name: "付与ロール", value: `<@&${role.id}>`, inline: true }
          )
          .setFooter({ text: `時刻: ${nowJST()}` })
      );
    }
  });
}
