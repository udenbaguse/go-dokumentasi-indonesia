const fs = require("fs");
const path = require("path");

const docsDir = path.join(__dirname, "..", "src", "docs");
const outputFile = path.join(docsDir, "docs.json");

const files = fs.readdirSync(docsDir);
const allDocs = {};

for (const file of files) {
  if (!file.endsWith(".json")) continue;
  if (file === "docs.json") continue;

  const filePath = path.join(docsDir, file);
  const json = JSON.parse(fs.readFileSync(filePath, "utf8"));
  Object.assign(allDocs, json);
}

fs.writeFileSync(outputFile, JSON.stringify(allDocs));
console.log(`Merged ${Object.keys(allDocs).length} docs entries to docs.json`);