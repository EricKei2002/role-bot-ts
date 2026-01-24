# Role Bot TS

「Role Bot TS」は、Discordコミュニティの健全性を維持し、新規参加者のオンボーディングを自動化するために設計された、高機能なBotシステムです。
自己紹介チャンネルへの投稿をリアルタイムで監視・検証し、適切なフォーマットでの投稿が確認されたユーザーに対して自動的にロールを付与します。

TypeScriptによる堅牢な型安全性と、Discord.js v14のモダンな機能を活用し、スケーラブルかつメンテナンス性の高いアーキテクチャを実現しています。

## 🚀 主な機能 (Features)

### 1. スマートな自己紹介認証 (Smart Intro Authentication)

- **Rule-Based Validation**: `introAuth` モジュールにより、自己紹介文がコミュニティの規定（文字数、必須キーワードなど）を満たしているかを厳密にチェックします。
- **Auto Role Assignment**: 検証を通過したユーザーに対し、自動的に「認証済みロール」を付与。手動での承認フローを完全に排除し、即座にコミュニティへの参加を可能にします。
- **Feedback System**: 不適切な投稿に対しては、具体的な改善点をフィードバック。ユーザーの再投稿をスムーズに促します。

### 2. 高可用性と監視 (Reliability & Monitoring)

- **Docker Containerization**: アプリケーションをコンテナ化することで、環境差異を排除し、どこでも安定して動作するポータビリティを実現しています。
- **Type Safety**: 全面的にTypeScriptを採用することで、開発時のバグ混入を未然に防ぎ、安定した動作を保証します。

## 🛠 技術スタック (Tech Stack)

### Core

- **Runtime**: [Node.js](https://nodejs.org/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Framework**: [Discord.js v14](https://discord.js.org/)

### Infrastructure & Tooling

- **Containerization**: [Docker](https://www.docker.com/)
- **Testing**: [Vitest](https://vitest.dev/)
- **Environment**: [Dotenv](https://github.com/motdotla/dotenv)

## 💻 セットアップ (Getting Started)

プロジェクトをローカル環境またはサーバーで実行する手順です。

### 1. リポジトリのクローン

```bash
git clone https://github.com/EricKei2002/role-bot-ts.git
cd role-bot-ts
```

### 2. 環境変数の設定

`.env` ファイルを作成し、BotのToken等を設定します。

```bash
DISCORD_TOKEN=your_discord_bot_token
GUILD_ID=your_target_guild_id
TARGET_CHANNEL_ID=intro_channel_id
ROLE_ID=verified_role_id
```

### 3. Dockerでの起動 (推奨)

```bash
# イメージのビルド
docker build -t role-bot-ts .

# コンテナの起動
docker run -d --env-file .env --name role-bot role-bot-ts
```

### 4. ローカル開発 (npm)

```bash
npm install
npm run dev
```

## 📂 プロジェクト構造 (Project Structure)

ドメイン駆動設計（DDD）を意識した、機能ごとのディレクトリ構成を採用しています。

```
src/
├── config/          # 環境変数や定数の定義
├── discord/         # Discord Clientの初期化とイベントハンドラ
├── features/        # 機能ドメイン (e.g., introAuth)
│   └── introAuth/   # 自己紹介認証機能のロジックとルール
├── services/        # 共有サービス (Logging, API wrappers etc.)
└── utils/           # 汎用ユーティリティ
```

---

© 2026 Eric Kei
