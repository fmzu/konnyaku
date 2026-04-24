import chalk from "chalk";

export function highlightEnglish(text: string): string {
  // Highlight text in「」(remove brackets)
  let result = text.replace(/「([^」]+)」/g, (_, content) =>
    chalk.cyan(content),
  );
  // Highlight text in ""(remove quotes)
  result = result.replace(/"([^"]+)"/g, (_, content) => chalk.cyan(content));
  // Highlight standalone English words/phrases between non-ASCII chars.
  // \x00-\x7F is an intentional ASCII range (non-ASCII lookaround), so we suppress the rule.
  result = result.replace(
    // biome-ignore lint/suspicious/noControlCharactersInRegex: \x00-\x7F is intentional ASCII range
    /(?<=[^\x00-\x7F]|^)([A-Za-z][A-Za-z\s'.,\-~]+[A-Za-z.])(?=[^\x00-\x7F]|$)/g,
    (match) => chalk.cyan(match),
  );
  return result;
}
