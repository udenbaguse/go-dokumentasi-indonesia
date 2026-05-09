const createHoverProvider = require("./hoverProvider");

/**
 * Entry point when the extension is activated.
 *
 * @param {import('vscode').ExtensionContext} context
 */
function activate(context) {
  const hoverProvider = createHoverProvider({
    languages: [
    "go"
],
  });

  context.subscriptions.push(hoverProvider);

  console.log("Go Dokumentasi Indonesia is active.");
}

function deactivate() {}

module.exports = {
  activate,
  deactivate,
};
