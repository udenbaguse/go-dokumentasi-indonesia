const vscode = require("vscode");
const loadDocs = require("./docsLoader");
const { getArrayHover } = require("./arrayHover");

const DEFAULT_LANGUAGES = ["go"];
const docs = loadDocs();

/**
 * Buat tampilan Markdown untuk hover.
 *
 * @param {{ title: string, description: string, syntax?: string, example?: string }} doc
 */
function createMarkdown(doc) {
  const markdown = new vscode.MarkdownString();

  markdown.appendMarkdown(`## ${doc.title}\n\n`);
  markdown.appendMarkdown(`${doc.description}\n\n`);

  if (doc.syntax) {
    markdown.appendMarkdown("### Syntax\n");
    markdown.appendCodeblock(doc.syntax, "go");
  }

  if (doc.example) {
    markdown.appendMarkdown("### Contoh\n");
    markdown.appendCodeblock(doc.example, "go");
  }

  return markdown;
}

/**
 * Hindari hover aktif di dalam string atau comment sederhana.
 *
 * @param {import('vscode').TextDocument} document
 * @param {import('vscode').Position} position
 */
function isInsideStringOrComment(document, position) {
  const textBeforePosition = document.getText(
    new vscode.Range(new vscode.Position(0, 0), position),
  );
  let state = null;

  for (let index = 0; index < textBeforePosition.length; index++) {
    /** @type {string} */
    const char = textBeforePosition[index];
    /** @type {string | undefined} */
    const next = textBeforePosition[index + 1];

    if (state === "lineComment") {
      if (char === "\n" || char === "\r") state = null;
      continue;
    }

    if (state === "blockComment") {
      if (char === "*" && next === "/") {
        state = null;
        index++;
      }
      continue;
    }

    if (state) {
      if (char === "\\") {
        index++;
        continue;
      }

      if (char === state) state = null;
      continue;
    }

    if (char === "/" && next === "/") {
      state = "lineComment";
      index++;
      continue;
    }

    if (char === "/" && next === "*") {
      state = "blockComment";
      index++;
      continue;
    }

    if (char === "'" || char === '"' || char === "`") {
      state = char;
    }
  }

  return Boolean(state);
}

/**
 * @param {string} char
 */
function isIdentifierPart(char) {
  return Boolean(char && /[A-Za-z0-9_]/.test(char));
}

/**
 * Ambil selector di sisi kiri kata, misalnya Println -> fmt.Println.
 *
 * @param {import('vscode').TextDocument} document
 * @param {import('vscode').Range} range
 */
function getSelectorAtRange(document, range) {
  const line = document.lineAt(range.start.line).text;
  let start = range.start.character;

  while (start > 1 && line[start - 1] === ".") {
    let identifierStart = start - 1;

    while (identifierStart > 0 && isIdentifierPart(line[identifierStart - 1])) {
      identifierStart--;
    }

    if (identifierStart === start - 1) break;
    start = identifierStart;
  }

  if (start === range.start.character) return null;

  return {
    text: line.slice(start, range.end.character),
    range: new vscode.Range(
      new vscode.Position(range.start.line, start),
      range.end,
    ),
  };
}

/**
 * Buat hover provider reusable.
 *
 * Data hover dibaca dari file JSON di folder src/docs.
 * Key JSON bisa berupa kata tunggal atau selector seperti fmt.Println.
 *
 * @param {{ languages?: string[] }} [options]
 */
function createHoverProvider(options = {}) {
  const languages = options.languages || DEFAULT_LANGUAGES;

  return vscode.languages.registerHoverProvider(languages, {
    provideHover(document, position) {
      const range = document.getWordRangeAtPosition(position);
      if (!range) return null;

      if (isInsideStringOrComment(document, range.start)) return null;

      // 1) Array hover
      const arrayHover = getArrayHover(document, position);
      if (arrayHover) {
        return new vscode.Hover(arrayHover.markdown, arrayHover.hoverRange);
      }

      // 2) Existing docs hover
      const word = document.getText(range);
      const selector = getSelectorAtRange(document, range);
      const doc =
        selector && docs[selector.text] ? docs[selector.text] : docs[word];
      const hoverRange =
        selector && docs[selector.text] ? selector.range : range;

      if (!doc) return null;

      return new vscode.Hover(createMarkdown(doc), hoverRange);
    },
  });
}

module.exports = createHoverProvider;
