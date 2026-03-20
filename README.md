# konnyaku

ほんやくコンニャクにインスパイアされた、CLIで使える翻訳ツール。ニュアンス解説つき。

バックエンドに `claude` CLI（Claude Code）を使用するため、APIキーの設定は不要。

## 前提条件

- [Node.js](https://nodejs.org/) v18以上
- [Claude Code](https://docs.anthropic.com/en/docs/claude-code)（`claude` コマンドが認証済みの状態）

## インストール

```bash
npm install -g konnyaku
```

インストールせずに実行することもできる：

```bash
npx konnyaku Hello!
```

## 使い方

```bash
konnyaku <翻訳したいテキスト>
```

言語は自動判定される。英語を入力すれば日本語に、日本語を入力すれば英語に翻訳する。

### 英語 → 日本語

```bash
konnyaku I appreciate your help with this matter.
```

### 日本語 → 英語

```bash
konnyaku お忙しいところ恐れ入りますが、ご確認をお願いいたします。
```

日本語→英語の場合は、翻訳後にトーン（カジュアル/フォーマル）の調整ができる。

## 技術スタック

- TypeScript / Node.js
- chalk（ターミナル装飾）
- Claude Code CLI（翻訳エンジン）
