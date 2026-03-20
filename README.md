# konnyaku

CLIで使える翻訳ツール。翻訳結果に加えてニュアンスの解説を表示する。

## 前提条件

- [Node.js](https://nodejs.org/) v18以上
- [Codex CLI](https://github.com/openai/codex) (`codex` コマンドが使える状態)

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

## 設定

AIコマンドを変更できる。設定は `~/.config/konnyaku/settings.json` に保存される。

```bash
# コマンドを変更
konnyaku use "codex exec"

# 現在の設定を確認
konnyaku use
```

## 技術スタック

- TypeScript / Node.js
- chalk（ターミナル装飾）
