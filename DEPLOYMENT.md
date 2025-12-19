# Vercelへのデプロイ手順

このドキュメントは、Positive Words Cascade Web版をVercelで永続的にホスティングするための手順を説明しています。

## 前提条件

- GitHubアカウント
- Vercelアカウント（無料）

## デプロイ手順

### 1. GitHubにリポジトリを作成

1. [GitHub](https://github.com)にアクセスしてログイン
2. 右上の「+」アイコンから「New repository」を選択
3. リポジトリ名を入力（例：`positive-words-cascade-web`）
4. 「Create repository」をクリック

### 2. ローカルリポジトリをGitHubにプッシュ

```bash
cd /home/ubuntu/positive-words-cascade-web

# リモートリポジトリを追加
git remote add origin https://github.com/YOUR_USERNAME/positive-words-cascade-web.git

# ブランチをmainに変更
git branch -M main

# GitHubにプッシュ
git push -u origin main
```

※ `YOUR_USERNAME` はあなたのGitHubユーザー名に置き換えてください

### 3. Vercelでデプロイ

1. [Vercel](https://vercel.com)にアクセスしてログイン（GitHubアカウントでログイン可能）
2. 「New Project」をクリック
3. GitHubリポジトリを選択（`positive-words-cascade-web`）
4. プロジェクト設定を確認
   - Framework: Vite
   - Root Directory: ./
   - Build Command: `npm run build`
   - Output Directory: `dist`
5. 「Deploy」をクリック

### 4. デプロイ完了

デプロイが完了すると、Vercelが自動的にURLを生成します。このURLがあなたのアプリの永続的なホスティングアドレスになります。

例：`https://positive-words-cascade-web.vercel.app`

## 自動デプロイの設定

GitHubにプッシュするたびに、Vercelが自動的に最新版をデプロイします。

### 環境変数の設定（必要な場合）

1. Vercelダッシュボードでプロジェクトを選択
2. 「Settings」→「Environment Variables」
3. 必要な環境変数を追加

## トラブルシューティング

### デプロイが失敗する場合

1. ビルドログを確認
2. `package.json`の依存関係を確認
3. `vite.config.ts`の設定を確認

### パフォーマンスの最適化

- 画像の最適化
- コード分割
- キャッシング戦略の設定

## サポート

詳細は[Vercel公式ドキュメント](https://vercel.com/docs)を参照してください。
