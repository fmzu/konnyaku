import { copyToClipboard } from "./copy-to-clipboard.js";
import { isClipboardSupported } from "./is-clipboard-supported.js";

/**
 * クリップボードコピーに対応しているプラットフォームでのみコピーを実行し、完了メッセージを表示する。
 * 非対応プラットフォームでは何もしない。
 */
export async function copyWithMessage(
  text: string,
  deps: {
    copyToClipboard: typeof copyToClipboard;
    isClipboardSupported: typeof isClipboardSupported;
  } = { copyToClipboard, isClipboardSupported },
): Promise<void> {
  if (!deps.isClipboardSupported()) return;

  await deps.copyToClipboard(text);
  console.log("📋 コピーしました");
}
