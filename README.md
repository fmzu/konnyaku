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

日本語→英語の場合は、カジュアル/ふつう/ビジネスの3トーンを一度に生成する。各バリアントには英訳と、その英訳が日本語でどう聞こえるか（gloss）を併記する。

```
[カジュアル] Sorry, I'm late!
  （ごめん、遅刻しちゃった！）

[ふつう] I'm sorry for being late.
  （すみません、遅刻しました）

[ビジネス] I sincerely apologize for my late arrival.
  （大変申し訳ございません、遅刻いたしました）
```

続けて表示される選択肢からどれを使うか選ぶと、その英文だけが自動でクリップボードにコピーされる（macOSのみ。「コピーしない」も選べる）。

英語→日本語の場合は、翻訳結果とニュアンス解説をそのまま表示する（トーンバリアントはなし）。

AI呼び出し中はスピナーで経過秒数を表示する。AIコマンドの内部ログ（stderr）は失敗時のみエラーメッセージとして表示され、通常時は画面に出さない。

### 敬語変換（keigo）

カジュアルな日本語をSlack向けの敬語に変換する。変換結果は自動でクリップボードにコピーされる（macOSのみ）。

```bash
keigo 明日休みます
# → 明日お休みをいただきます。よろしくお願いいたします。
# 📋 コピーしました

keigo 資料できたので確認してください
# → 資料が完成いたしましたので、ご確認いただけますでしょうか。
# 📋 コピーしました
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
- AIコマンド（デフォルト: [Codex CLI](https://github.com/openai/codex)。`codex exec --skip-git-repo-check` として実行される。gitリポジトリ外でも動かすために必要なフラグ）
