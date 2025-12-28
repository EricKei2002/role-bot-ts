# 🤖 role-bot-ts（自己紹介認証Bot）

新規参加者に **自己紹介フォーム（Modal）** を案内し、  
入力内容を検証したうえで **自動的にロールを付与する Discord 認証Bot** です。

自己紹介は **テキスト投稿では行わず**、  
**ボタン → Modal（フォーム）入力** による認証フローを採用しています。

本Botは **Raspberry Pi 上の自宅サーバー** で 24/7 稼働しており、  
**GitHub Actions + Tailscale + pm2** による CI/CD 運用を行っています。

---

## ✨ 機能一覧

- 🧑‍🤝‍🧑 **新規参加者向け自己紹介ボタン案内**
- 🧾 **Modal（フォーム）入力による自己紹介**
- ✅ **必須項目チェック**
  - 名前 / 目的 / 一言
- 🧩 **任意項目対応**
  - 年齢 / 性別
- 🚫 **NG判定**
  - 空入力 / 無効フォーマット
- 🎭 **認証成功時**
  - Member ロール付与
- ❌ **認証失敗時**
  - ロール未付与 + エラー理由を記録
- 🧾 **管理ログ**
  - 成功 / 失敗を管理チャンネルに Embed で保存（DBなし）

---

## 🔐 自己紹介認証フロー（ボタン & Modal）

### ① 新規参加者

1. ユーザーがサーバーに参加
2. 自己紹介チャンネルに **案内メッセージ（ボタン付き）** を表示  
   ※ すでに案内が存在する場合は **再投稿しない（冪等設計）**
3. ユーザーが **「自己紹介する」ボタン** をクリック
4. **Modal（フォーム）** が開き、以下を入力：

| 項目 | 必須 |
|---|---|
| 名前 | ✅ |
| 年齢 | 任意 |
| 性別 | 任意 |
| 目的 | ✅ |
| 一言 | ✅ |

---

### ② Modal送信後の処理

- 入力内容を **自己紹介チャンネルに Embed として投稿**
- 内容を検証（必須項目・不正入力）
- 結果に応じて処理を分岐：

#### ✅ 認証成功
- Member ロールを付与
- 管理ログチャンネルに **成功ログ（Embed）** を送信

#### ❌ 認証失敗
- ロールは付与しない
- 管理ログチャンネルに **失敗ログ（Embed）** を送信

※ 認証履歴は **DBを使わず、管理ログEmbedを記録として利用**しています。

---

## 🧠 アーキテクチャ概要

- Discordイベント処理と認証ロジックを分離
- 認証ロジックは feature 単位で管理
- Discord 依存を薄くし、単体テスト可能な設計

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
      rules.ts              # 入力ルール・検証定義
      rules.test.ts         # 単体テスト（Vitest）
      service.ts            # 認証ロジック本体
      types.ts              # feature専用型
  services/
    logger.ts               # 管理ログ送信（Embed）
  dist/

```
⸻

🧪 テスト
	•	Vitest を使用
	•	Discord に依存しない認証ロジックを単体テスト
```txt
npm run test

```
⸻

🚀 セットアップ

1) インストール

npm install

2) 環境変数（.env）

.env.example をコピーして .env を作成してください。
```txt
DISCORD_TOKEN=
GUILD_ID=
INTRO_CHANNEL_ID=
MEMBER_ROLE_ID=
LOG_CHANNEL_ID=
MIN_JOIN_MINUTES= # 任意：参加から何分後に認証可能にするか

```
⸻

▶️ 起動方法

🧑‍💻 開発
```txt
npm run dev
```
🏭 本番
```txt
npm run build
npm run start
```
🟩 pm2（24/7運用）
```txt
npm run build
npm run start:pm2
```

⸻

🖥️ 運用構成（自宅サーバー）
	•	Raspberry Pi（Linux）
	•	pm2
	•	プロセス常駐管理 / 自動再起動
	•	Tailscale
	•	GitHub Actions から自宅サーバーへ安全接続
	•	GitHub Actions
	•	main ブランチ push で自動デプロイ

CI/CD フロー
```txt
GitHub Push
  ↓
GitHub Actions
  ↓
Tailscale 接続
  ↓
Raspberry Pi（SSH）
  ↓
npm ci → build → pm2 restart
```

⸻

🔐 Botに必要な権限
	•	✅ View Channels / Read Messages
	•	✅ Send Messages
	•	✅ Read Message History
	•	✅ Manage Roles
	•	✅ Embed Links

⸻

🧰 設計上の工夫
	•	🧩 feature 単位で責務分離し、拡張・修正しやすい構成
	•	🧪 Discord 依存を切り離したテスト可能設計
	•	🗃 DB を使わず、管理ログ Embed を履歴として活用
	•	🖥 自宅サーバー × CI/CD による実運用経験

⸻

👤 Author

Eric Kei Yamamoto
GitHub: https://github.com/EricKei2002
