<<<<<<< HEAD

# Discord Role Bot

![Project Banner](public/discord.png)

コミュニティ運営を効率化する、自己紹介認証 Discord Bot です。
新規参加者が認証ボタンをクリックし、表示されるモーダル（フォーム）に必要事項を入力して送信することで、自動的に特定のロール（権限）を付与します。
自宅サーバー（Raspberry Pi 4）と Docker コンテナを用いた実運用環境で、24時間365日の安定稼働を実現しています。

## 🚀 主な機能 (Features)

### 1. 自動ロール付与 (Auto Role Assignment)

- **Interaction Modal**: ボタンクリックで専用フォームを表示し、入力を受け付けます。
- **Auto Validation**: 入力内容を自動検証し、即座にメンバーロールを付与。管理者の手動承認コストをゼロにします。

### 2. 管理ログの Embed 化

- **Log System**: 認証の成功/失敗ログを、データベースを使わずに Discord の特定チャンネルへ Embed 形式で記録。
- 視認性が高く、サーバー内だけで完結するシンプルな運用フローを構築しました。

### 3. 自宅サーバー × CI/CD

- **Self-Hosted**: Raspberry Pi 4 (Ubuntu) 上で Docker コンテナとして稼働。
- **CI/CD Pipeline**: GitHub Actions を導入し、main ブランチへのプッシュで自動テスト(Vitest)とデプロイを実行します。

## 🛠 技術スタック (Tech Stack)

### Core

- **Runtime**: [Node.js](https://nodejs.org/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Library**: [Discord.js](https://discord.js.org/)

### Infrastructure

- **Server**: Raspberry Pi 4 (Ubuntu Server)
- **Container**: [Docker](https://www.docker.com/)
- **CI/CD**: GitHub Actions

### Testing

- **Test Framework**: [Vitest](https://vitest.dev/)

## 💻 セットアップ (Getting Started)

### 1. 依存関係のインストール

```bash
npm install
# or
bun install
```

=======

⸻

🤖 role-bot-ts（自己紹介認証Bot）

新規参加者に 自己紹介フォーム（Modal） を案内し、
入力内容を検証したうえで 自動的にロールを付与する Discord 認証Bot です。

自己紹介は テキスト投稿では行わず、
ボタン → Modal（フォーム）入力 による認証フローを採用しています。

本Botは Raspberry Pi 上の自宅サーバー で 24/7 稼働しており、
Docker / Docker Compose + GitHub Actions + Tailscale による
本番自動デプロイ運用を行っています。

⸻

✨ 機能一覧
• 🧑‍🤝‍🧑 新規参加者向け自己紹介ボタン案内
• 🧾 Modal（フォーム）入力による自己紹介
• ✅ 必須項目チェック
• 名前 / 目的 / 一言
• 🧩 任意項目対応
• 年齢 / 性別
• 🚫 NG判定
• 空入力 / 無効フォーマット
• 🎭 認証成功時
• Member ロール付与
• ❌ 認証失敗時
• ロール未付与 + エラー理由を記録
• 🧾 管理ログ
• 成功 / 失敗を管理チャンネルに Embed で保存（DBなし）

⸻

🔐 自己紹介認証フロー（ボタン & Modal）

① 新規参加者 1. ユーザーがサーバーに参加 2. 自己紹介チャンネルに 案内メッセージ（ボタン付き） を表示
※ すでに案内が存在する場合は 再投稿しない（冪等設計）3. ユーザーが 「自己紹介する」ボタン をクリック 4. Modal（フォーム） が開き、以下を入力：

項目 必須
名前 ✅
年齢 任意
性別 任意
目的 ✅
一言 ✅

⸻

② Modal送信後の処理
• 入力内容を 自己紹介チャンネルに Embed として投稿
• 内容を検証（必須項目・不正入力）
• 結果に応じて処理を分岐：

✅ 認証成功
• Member ロールを付与
• 管理ログチャンネルに 成功ログ（Embed） を送信

❌ 認証失敗
• ロールは付与しない
• 管理ログチャンネルに 失敗ログ（Embed） を送信

※ 認証履歴は DBを使わず、管理ログ Embed を記録として利用しています。

⸻

🧠 アーキテクチャ概要
• Discordイベント処理と認証ロジックを分離
• 認証ロジックは feature 単位で管理
• Discord 依存を薄くし、単体テスト可能な設計

⸻

🗂 ディレクトリ構成

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
• Vitest を使用
• Discord に依存しない認証ロジックを単体テスト

```txt
npm run test
```

⸻

🚀 セットアップ（ローカル開発）

1. インストール

```txt
npm install
```

2. 環境変数

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

> > > > > > > e5898930e83f50e2b31dffda8aa56dd39af615be

### 2. 環境変数の設定

`.env` ファイルを作成し、Botトークン等を設定します。

```bash
DISCORD_TOKEN=your_bot_token
GUILD_ID=your_server_id
CLIENT_ID=your_application_id
LOG_CHANNEL_ID=your_channel_id
```

### 3. 開発モードで起動

```bash
npm run dev
```

<<<<<<< HEAD

## 🧪 テスト (Testing)

Botの認証ロジックなどのコア機能は、Discord APIに依存しない形で単体テストが可能です。

````bash
npm run test
=======
🏭 本番（Docker）
```txt
docker compose up -d --build
>>>>>>> e5898930e83f50e2b31dffda8aa56dd39af615be
````

※ 本番環境では /etc/role-bot/env を使用し、
トークンはリポジトリや CI ログに露出しない構成にしています。

## 📂 プロジェクト構造 (Project Structure)

<<<<<<< HEAD

````
src/
├── commands/        # Slash Commands / Button Interactions
├── events/          # Event Handlers (ready, interactionCreate)
├── core/            # Core Logic (Validation, Embed generation)
└── utils/           # Helper functions
tests/               # Unit tests (Vitest)
=======
🖥️ 運用構成（自宅サーバー）
	•	Raspberry Pi（Ubuntu Linux）
	•	Docker / Docker Compose
	•	コンテナ常駐・自動再起動（restart policy）
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
docker compose up -d --build
>>>>>>> e5898930e83f50e2b31dffda8aa56dd39af615be
````

## 📜 ライセンス

MIT

---

<<<<<<< HEAD
© 2026 Eric Kei
=======
🧰 設計上の工夫
• 🧩 feature 単位で責務分離し、拡張・修正しやすい構成
• 🧪 Discord 依存を切り離したテスト可能設計
• 🗃 DB を使わず、管理ログ Embed を履歴として活用
• 🖥 Docker × CI/CD × 自宅サーバー による実運用経験

⸻

👤 Author

Eric Kei Yamamoto
GitHub: https://github.com/EricKei2002

⸻

> > > > > > > e5898930e83f50e2b31dffda8aa56dd39af615be
