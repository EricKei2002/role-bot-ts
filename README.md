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

## 🧪 テスト (Testing)

Botの認証ロジックなどのコア機能は、Discord APIに依存しない形で単体テストが可能です。

```bash
npm run test
```

## 📂 プロジェクト構造 (Project Structure)

```
src/
├── commands/        # Slash Commands / Button Interactions
├── events/          # Event Handlers (ready, interactionCreate)
├── core/            # Core Logic (Validation, Embed generation)
└── utils/           # Helper functions
tests/               # Unit tests (Vitest)
```

## 📜 ライセンス

MIT

---

© 2026 Eric Kei
