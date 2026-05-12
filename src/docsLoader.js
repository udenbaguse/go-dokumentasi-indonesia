const fs = require("fs");
const path = require("path");

function loadDocs() {
  const docsPath = path.join(__dirname, "docs", "docs.json");

  if (fs.existsSync(docsPath)) {
    return JSON.parse(fs.readFileSync(docsPath, "utf8"));
  }

  const docsDir = path.join(__dirname, "docs");
  if (!fs.existsSync(docsDir)) {
    return {};
  }

  const files = fs.readdirSync(docsDir);
  const allDocs = {};

  for (const file of files) {
    if (!file.endsWith(".json")) continue;

    const filePath = path.join(docsDir, file);
    const json = JSON.parse(fs.readFileSync(filePath, "utf8"));

    Object.assign(allDocs, json);
  }

  return allDocs;
}

module.exports = loadDocs;