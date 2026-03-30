import chalk from "chalk";

export function highlightEnglish(text: string): string {
  // Highlight text in「」(remove brackets)
  let result = text.replace(/「([^」]+)」/g, (_, content) => chalk.cyan(content));
  // Highlight text in ""(remove quotes)
  result = result.replace(/"([^"]+)"/g, (_, content) => chalk.cyan(content));
  // Highlight standalone English words/phrases between non-ASCII chars
  result = result.replace(/(?<=[^\x00-\x7F]|^)([A-Za-z][A-Za-z\s'.,\-~]+[A-Za-z.])(?=[^\x00-\x7F]|$)/g,
    (match) => chalk.cyan(match));
  return result;
}
