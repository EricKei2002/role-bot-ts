⸻

role-bot-ts

自己紹介テンプレを投稿すると、自動でロールを付与する Discord 認証Bot です。
テンプレ不足時は理由をユーザーに通知し、管理ログに履歴を残します。

⸻

概要
	•	自己紹介テンプレをチェックし、必須項目が揃っていれば認証
	•	認証成功でロール付与 + ✅リアクション
	•	認証失敗時は不足項目を返信（10秒後に自動削除）
	•	認証結果は 管理ログチャンネルのEmbedとして保存
	•	DBは使用せず、Discordログを履歴として活用

⸻

主な機能
	•	テンプレ必須項目チェック（名前 / 目的 / 一言）
	•	任意項目対応（年齢 / 性別）
	•	URL・空入力などのNG判定
	•	認証成功・失敗の管理ログ出力（Embed）
	•	チャンネル荒れ防止（自動返信削除）
	•	feature単位での設計

⸻

使用技術
	•	TypeScript
	•	Node.js
	•	discord.js v14
	•	Vitest（単体テスト）
	•	pm2（本番運用）

⸻

アーキテクチャ

Discordイベント層と認証ロジックを分離した構成です。
自己紹介テンプレの解析・検証は feature 単位で管理しています。
永続化が不要なため、認証結果は管理ログEmbedとして保存しています。

⸻

ディレクトリ構成（抜粋）

src/
  index.ts
  discord/          # Discordイベント処理
  features/
    introAuth/      # 自己紹介認証ロジック
  services/         # ロール付与・ログ送信など共通処理
  utils/            # 汎用ユーティリティ


⸻

テンプレ例

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


⸻

テスト

Vitestを使用し、Discordに依存しない認証ロジックを
feature単位で単体テストしています。

npm run test


⸻

起動方法

開発環境

npm install
npm run dev

本番運用（pm2）

npm run build
npm run start:pm2


⸻

設計上の工夫
	•	Discord依存処理とロジックを分離し、テストしやすい構成にしています
	•	小規模BotのためDBは使用せず、管理ログを履歴保存として活用しています
	•	機能追加を想定し、feature単位で拡張しやすくしています

⸻

今後の拡張予定
	•	#rules 既読リアクション必須の二段階認証
	•	NG判定ルールの追加
	•	複数サーバー対応

⸻

作者

Eric Kei Yamamoto
GitHub: https://github.com/EricKei2002

⸻
