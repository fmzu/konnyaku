/**
 * 現在のプラットフォームでクリップボードコピー（pbcopy）が使えるかどうかを判定する。
 */
export function isClipboardSupported(
  platform: NodeJS.Platform = process.platform,
): boolean {
  return platform === "darwin";
}
