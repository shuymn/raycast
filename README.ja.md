# Raycast スクリプト

個人用の Raycast スクリプトコマンドコレクション。

## セットアップ

1. このリポジトリをクローン
2. [Raycast](https://raycast.com/) をインストール
3. Raycast にスクリプトを追加:
   - Raycast の設定を開く
   - Extensions → Script Commands に移動
   - スクリプトディレクトリまたは個別のスクリプトを追加

## スクリプト

### Translate（翻訳）

Claude Code で使用するために、Claude AI を使ってテキストを英語に翻訳します。

**セットアップ:**

1. translate パッケージ内の `.env.example` を `.env` にコピー
2. Anthropic API キーを追加:
   ```
   ANTHROPIC_API_KEY=your_api_key_here
   ```

**使い方:**

- 任意のアプリケーションでテキストを選択
- Raycast で translate コマンドを実行
- 翻訳されたテキストが自動的にクリップボードにコピーされます

## 必要な環境

- [Deno](https://deno.land/) ランタイム
- Raycast アプリ
- 各サービスの API キー（個別のスクリプトドキュメントを参照）

## 開発

スクリプトは `packages/` ディレクトリに整理されています。各スクリプトは Raycast
メタデータヘッダーを持つスタンドアロンの Deno TypeScript ファイルです。

### 利用可能なコマンド

```bash
# コードのフォーマット
deno task fmt

# フォーマットチェック
deno task fmt:check

# リンター実行
deno task lint

# 全スクリプトの型チェック
deno task check

# Raycast ヘッダーの検証
deno task verify

# 全 CI チェックを実行
deno task ci

# コミット前チェック
deno task pre-commit
```

### 新しいスクリプトの作成

1. `packages/` 配下に新しいディレクトリを作成
2. 適切な Raycast ヘッダーを含む TypeScript ファイルを追加
3. シバン行に必要な権限を含める
4. 必要な環境変数を `.env.example` に追加

### CI/CD

このプロジェクトは継続的インテグレーションに GitHub Actions を使用しています。すべてのコードはマージ前にフォーマット、リント、型チェック、Raycast ヘッダー検証に合格する必要があります。
