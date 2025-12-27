# 🤖 role-bot-ts（自己紹介認証Bot）

自己紹介テンプレを投稿すると、自動でロールを付与する **Discord 認証Bot** です。  
テンプレ不足時は不足項目をユーザーに通知し（⏱10秒後に自動削除）、**管理ログ（Embed）に履歴を残します**。

---

## ✨ できること

- ✅ **自己紹介テンプレの必須項目チェック**（名前 / 目的 / 一言）
- 🧩 **任意項目対応**（年齢 / 性別）
- 🚫 **NG判定**（URL / 空入力など）
- 🎭 認証成功で **ロール付与 + ✅リアクション**
- 💬 認証失敗で **不足項目を返信**（⏱10秒後に自動削除）
- 🧾 **管理ログチャンネルにEmbedで保存**（DBなし）

---

## 🧠 アーキテクチャ（3行）

Discordイベント層と認証ロジックを分離した構成です。  
自己紹介テンプレの解析・検証は feature 単位で管理しています。  
永続化が不要なため、認証結果は管理ログEmbedとして保存しています。

---

## 🗂 ディレクトリ構成（短縮版）あ

```txt
src/
  index.ts
  discord/          # Discordイベント処理（薄く）
  features/
    introAuth/      # 自己紹介認証ロジック（本体）
  services/         # 共通処理（ログ送信・ロール付与など）
  utils/            # 汎用関数


⸻

📝 自己紹介テンプレ（例）

【名前】
Eric

【年齢】（任意）
23

【性別】（任意）
男

【目的】
交流したい

【一言】
よろしく！

✅ 必須 / 任意
	•	必須：【名前】 / 【目的】 / 【一言】
	•	任意：【年齢】 / 【性別】

⸻

🧪 テスト

Vitest を使用し、Discordに依存しない認証ロジックを feature単位で単体テストしています。

npm run test


⸻

🚀 セットアップ

1) インストール

npm install

2) 環境変数（.env）

.env.example をコピーして .env を作成し、IDを埋めてください。
	•	DISCORD_TOKEN
	•	GUILD_ID
	•	INTRO_CHANNEL_ID
	•	MEMBER_ROLE_ID
	•	LOG_CHANNEL_ID
	•	MIN_JOIN_MINUTES（任意：参加から何分後に認証OKにするか）

⸻

▶️ 起動方法

🧑‍💻 開発（ホット実行）

npm run dev

🏭 本番（ビルドして起動）

npm run build
npm run start

🟩 pm2（24/7運用）

npm run build
npm run start:pm2


⸻

🔐 Botに必要な権限

最低限おすすめ：
	•	✅ View Channels / Read Messages
	•	✅ Send Messages
	•	✅ Read Message History
	•	✅ Add Reactions
	•	✅ Manage Roles（ロール付与）
	•	✅ Manage Messages（返信の自動削除に必要）
	•	✅ Embed Links（管理ログをEmbedで出す）

⸻

🧰 設計上の工夫
	•	🧩 feature単位で機能をまとめ、修正・追加がしやすい構成
	•	🧪 Discord依存を薄くして、ロジックを単体テスト可能に
	•	🗃 DBを使わず、管理ログ（Embed）を履歴保存として活用

⸻

🗺 今後の拡張（予定）
	•	✅ #rules 既読リアクション必須の 二段階認証
	•	🚫 NG判定ルールの強化（招待リンク・メンション等）
	•	🏢 複数サーバー対応（Guildごと設定）

⸻

👤 Author

Eric Kei Yamamoto
GitHub: https://github.com/EricKei2002

