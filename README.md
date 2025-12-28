了解です。
そのまま README.md にコピペして使える完成版（Markdown） を出します👇
※ ポートフォリオ提出・GitHub公開前提で整えています。

⸻


# 🤖 role-bot-ts（自己紹介認証Bot）

自己紹介テンプレートを投稿すると、自動でロールを付与する **Discord 認証Bot** です。  
テンプレートに不足がある場合は不足項目をユーザーに通知し、  
**管理ログ（Embed）に履歴を残します**。

本Botは **Raspberry Pi 上の自宅サーバー** で常時稼働しており、  
**GitHub Actions + Tailscale + pm2** による CI/CD 運用を行っています。

---

## ✨ 機能一覧

- ✅ **自己紹介テンプレの必須項目チェック**
  - 名前 / 目的 / 一言
- 🧩 **任意項目対応**
  - 年齢 / 性別
- 🚫 **NG判定**
  - URL / 空入力 / 無効フォーマット
- 🎭 **認証成功時**
  - ロール付与 + ✅リアクション
- 💬 **認証失敗時**
  - 不足項目を返信（⏱10秒後に自動削除）
- 🧾 **管理ログ**
  - 管理チャンネルに Embed で履歴保存（DBなし）

---

## 🧠 アーキテクチャ概要

- Discordイベント処理と認証ロジックを分離
- 認証ロジックは feature 単位で管理
- Discord 依存を薄くし、単体テスト可能な設計

永続化が不要なため、  
**認証結果は管理ログEmbedを履歴として利用**しています。

---

## 🗂 ディレクトリ構成

```txt
src/
  index.ts                  # エントリーポイント
  config/
    env.ts                  # 環境変数管理
  discord/
    handlers/
      introAuth.ts          # Discordイベント登録（薄い層）
  features/
    introAuth/
      rules.ts              # テンプレ定義・検証ルール
      rules.test.ts         # 単体テスト（Vitest）
      service.ts            # 認証ロジック本体
      types.ts              # feature専用型
  services/
    logger.ts               # 管理ログ送信（Embed）
  dist/


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

必須 / 任意
	•	必須：【名前】 / 【目的】 / 【一言】
	•	任意：【年齢】 / 【性別】

⸻

🧪 テスト
	•	Vitest を使用
	•	Discord に依存しない認証ロジックを単体テスト

npm run test


⸻

🚀 セットアップ

1) インストール

npm install

2) 環境変数（.env）

.env.example をコピーして .env を作成してください。

DISCORD_TOKEN=
GUILD_ID=
INTRO_CHANNEL_ID=
MEMBER_ROLE_ID=
LOG_CHANNEL_ID=
MIN_JOIN_MINUTES= # 任意（参加から何分後に認証可能にするか）


⸻

▶️ 起動方法

🧑‍💻 開発（ホットリロード）

npm run dev

🏭 本番

npm run build
npm run start

🟩 pm2（24/7運用）

npm run build
npm run start:pm2


⸻

🖥️ 運用構成（自宅サーバー）
	•	Raspberry Pi（Linux）
	•	pm2
	•	プロセス常駐管理・自動再起動
	•	Tailscale
	•	GitHub Actions から安全に自宅サーバーへ接続
	•	GitHub Actions
	•	main ブランチ push で自動デプロイ
	•	SSH 経由でビルド・再起動

CI/CD フロー

GitHub Push
  ↓
GitHub Actions
  ↓
Tailscale 接続
  ↓
Raspberry Pi (SSH)
  ↓
npm ci → build → pm2 restart


⸻

🔐 Botに必要な権限

最低限おすすめ：
	•	✅ View Channels / Read Messages
	•	✅ Send Messages
	•	✅ Read Message History
	•	✅ Add Reactions
	•	✅ Manage Roles
	•	✅ Manage Messages
	•	✅ Embed Links

⸻

🧰 設計上の工夫
	•	🧩 feature 単位で機能を分離し、拡張・修正しやすい
	•	🧪 Discord 依存を薄くし、ロジックを単体テスト可能に
	•	🗃 DB を使わず、管理ログ Embed を履歴として活用
	•	🖥 自宅サーバー × CI/CD による実運用経験

⸻

👤 Author

Eric Kei Yamamoto
GitHub: https://github.com/EricKei2002

