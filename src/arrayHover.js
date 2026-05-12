const vscode = require("vscode");

/**
 * Tentukan apakah token terlihat seperti akses array, misalnya: namaArray[3]
 * (hanya mendukung index literal angka)
 *
 * @param {string} word
 * @returns {{ name: string, index: number } | null}
 */
function parseArrayIndexToken(word) {
  const match = word.match(/^([A-Za-z_][A-Za-z0-9_]*)\[(\d+)\]$/);
  if (!match) return null;

  return { name: match[1], index: Number(match[2]) };
}

/**
 * Parse deklarasi array: var nama [N] T
 *
 * @param {string} text
 * @returns {Map<string, { length: number, elementType: string }>}
 */
function extractArrayDeclarations(text) {
  const decls = new Map();

  // supports: var a [3]int
  const re =
    /^\s*var\s+([A-Za-z_][A-Za-z0-9_]*)\s*\[\s*(\d+)\s*\]\s*([^\n;{]+)\s*$/gm;

  let m;
  while ((m = re.exec(text)) !== null) {
    const name = m[1];
    const length = Number(m[2]);
    const elementType = (m[3] || "").trim().replace(/\s+/g, " ");

    if (!Number.isFinite(length)) continue;
    if (!elementType) continue;

    decls.set(name, { length, elementType });
  }

  return decls;
}

/**
 * Parse assignment nilai array untuk index literal:
 *   a[0] = <value>
 *
 * Mengambil nilai sebagai teks sampai akhir baris atau sampai ';'
 *
 * @param {string} text
 * @returns {Map<string, Map<number, string>>} arrName -> (index -> valueText)
 */
function extractArrayAssignments(text) {
  const result = new Map();

  // supports: a[0] = 123 / a[0] = "abc"
  const re =
    /^\s*([A-Za-z_][A-Za-z0-9_]*)\s*\[\s*(\d+)\s*\]\s*=\s*([^;\n]+)\s*$/gm;

  let m;
  while ((m = re.exec(text)) !== null) {
    const name = m[1];
    const index = Number(m[2]);
    const rhs = (m[3] || "").trim();

    if (!result.has(name)) result.set(name, new Map());
    result.get(name).set(index, rhs);
  }

  return result;
}

/**
 * Mencari akses array pada baris yang sama yang mencakup posisi cursor.
 * Hanya mendukung pattern: nama[angka] (index literal).
 *
 * Hindari hover index-value jika cursor berada pada deklarasi array `var nama[LEN] T`
 * atau deklarasi multiline `var ( nama[LEN] T )`.
 *
 * @param {import('vscode').TextDocument} document
 * @param {import('vscode').Position} position
 * @returns {{ name: string, index: number, range: vscode.Range } | null}
 */
function matchArrayAccessAtPosition(document, position) {
  const cursorChar = position.character;

  // namaArray[angka]
  const accessRe = /([A-Za-z_][A-Za-z0-9_]*)\[(\d+)\]/g;

  const lineText = document.lineAt(position.line).text;

  // Apakah cursor berada di dalam blok: var ( ... ) ?
  let inVarBlock = false;
  for (let l = position.line; l >= 0; l--) {
    const t = document.lineAt(l).text.trim();
    if (!t) continue;

    if (t.includes("var (")) {
      inVarBlock = true;
      break;
    }
    if (t === ")") {
      inVarBlock = false;
      break;
    }
  }

  // Hindari matching index hover pada deklarasi array:
  // - var nama[LEN] TYPE (1 baris)
  // - var ( nama[LEN] TYPE ) (multiline)
  const inlineVarDeclRe =
    /^\s*var\s+([A-Za-z_][A-Za-z0-9_]*)\s*\[\s*(\d+)\s*\]\s*[^\n;{]+\s*$/;
  const inlineDeclMatch = inlineVarDeclRe.exec(lineText);

  const inVarBlockLineDeclRe =
    /^\s*([A-Za-z_][A-Za-z0-9_]*)\s*\[\s*(\d+)\s*\]\s*[^\n;{]+\s*$/;
  const blockDeclMatch = inVarBlock
    ? inVarBlockLineDeclRe.exec(lineText)
    : null;

  let m;
  while ((m = accessRe.exec(lineText)) !== null) {
    const name = m[1];
    const index = Number(m[2]);

    const start = m.index;
    const end = m.index + m[0].length; // eksklusif

    if (cursorChar >= start && cursorChar < end) {
      // Jika cursor berada pada token [LEN] di deklarasi, jangan tampilkan hover index-value.
      if (inlineDeclMatch) {
        const declName = inlineDeclMatch[1];
        const declLen = Number(inlineDeclMatch[2]);

        if (name === declName && index === declLen) {
          return null;
        }
      }

      if (blockDeclMatch) {
        const declName = blockDeclMatch[1];
        const declLen = Number(blockDeclMatch[2]);

        if (name === declName && index === declLen) {
          return null;
        }
      }

      const hoverRange = new vscode.Range(
        new vscode.Position(position.line, start),
        new vscode.Position(position.line, end),
      );

      return { name, index, range: hoverRange };
    }
  }

  return null;
}

/**
 * Ambil data hover array (panjang/tampilan nilai) dari dokumen saat ini.
 *
 * @param {import('vscode').TextDocument} document
 * @param {import('vscode').Position} position
 * @param {Map<string, any>} cache
 * @returns {any|null}
 */
function getArrayHover(document, position, cache) {
  const docKey = String(document.uri);

  if (!cache.has(docKey)) {
    const text = document.getText();

    cache.set(docKey, {
      declarations: extractArrayDeclarations(text),
      assignments: extractArrayAssignments(text),
    });
  }

  const { declarations, assignments } = cache.get(docKey);

  // 1) Prioritas: deteksi akses array dari teks baris + posisi cursor
  const arrayAccess = matchArrayAccessAtPosition(document, position);
  if (arrayAccess) {
    const decl = declarations.get(arrayAccess.name);
    if (!decl) return null;

    const { length, elementType } = decl;
    const { index } = arrayAccess;

    if (index >= length) {
      const markdown = new vscode.MarkdownString();
      markdown.appendMarkdown(`### index melebihi batas maksimal\n\n`);
      markdown.appendMarkdown(
        `index **${index}** melebihi batas maksimal **0..${length - 1}**.\n`,
      );

      return {
        kind: "array-index-oob",
        hoverRange: arrayAccess.range,
        markdown,
      };
    }

    const arrAssign = assignments.get(arrayAccess.name);
    const value =
      arrAssign && arrAssign.has(index) ? arrAssign.get(index) : null;

    const markdown = new vscode.MarkdownString();
    markdown.appendMarkdown(`## ${arrayAccess.name}[${index}]\n\n`);
    markdown.appendMarkdown(`- Panjang array: **${length}**\n`);
    markdown.appendMarkdown(`- Tipe data: **${elementType.trim()}**\n`);
    markdown.appendMarkdown(
      `- Nilai: **${value !== null ? value : "tidak diketahui"}**\n`,
    );

    return {
      kind: "array-index-value",
      hoverRange: arrayAccess.range,
      markdown,
    };
  }

  // 2) Fallback: hover di nama array (identifier)
  const wordRange = document.getWordRangeAtPosition(position);
  if (!wordRange) return null;

  const word = document.getText(wordRange);
  const decl = declarations.get(word);
  if (!decl) return null;

  const markdown = new vscode.MarkdownString();
  markdown.appendMarkdown(`## ${word}\n\n`);
  markdown.appendMarkdown(`- Panjang array: **${decl.length}**\n`);
  markdown.appendMarkdown(`- Tipe data: **${decl.elementType}**\n`);

  return {
    kind: "array-length",
    hoverRange: wordRange,
    markdown,
  };
}

module.exports = {
  getArrayHover,
};
