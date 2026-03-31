# konnyaku

日本人のためのCLI翻訳ツール。翻訳結果に加えてニュアンスや文法の解説を表示する。

## インストール

```bash
bun add -g konnyaku
```

インストールせずに実行することもできる：

```bash
bunx konnyaku Hello!
```

## 使い方

### 翻訳（konnyaku）

```bash
konnyaku <翻訳したいテキスト>
```

言語は自動判定される。英語を入力すれば日本語に、日本語を入力すれば英語に翻訳する。

```bash
# 英語 → 日本語
konnyaku I appreciate your help with this matter.

# 日本語 → 英語
konnyaku お忙しいところ恐れ入りますが、ご確認をお願いいたします。
```

日本語→英語の場合は、翻訳後にトーン（カジュアル/フォーマル）の調整ができる。

### 敬語変換（keigo）

カジュアルな日本語をSlack向けの敬語に変換する。

```bash
keigo 明日休みます
# → 明日お休みをいただきます。よろしくお願いいたします。

keigo 資料できたので確認してください
# → 資料が完成いたしましたので、ご確認いただけますでしょうか。
```

## 設定

AIコマンドを変更できる。設定は `~/.config/konnyaku/settings.json` に保存される。

```bash
# コマンドを変更
konnyaku use "claude -p"

# 現在の設定を確認
konnyaku use
```

`keigo` も同じ設定を共有する。

```bash
keigo use "claude -p"
```

## 前提条件

- [Node.js](https://nodejs.org/) v18以上
- AIコマンド（デフォルト: [Codex CLI](https://github.com/openai/codex)）
