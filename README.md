# Go Dokumentasi Indonesia

hover-popup dokumentasi go dalam bahasa indonesia

Repository: https://github.com/udenbaguse/go-dokumentasi-indonesia.git

## Features

- Simple hover documentation for VS Code.
- Hover content is stored as JSON in `src/docs`.
- Active languages: `go`.

## Structure

- `src/extension.js`: extension entry point.
- `src/hoverProvider.js`: reusable hover provider.
- `src/docsLoader.js`: JSON documentation loader.
- `src/docs/example.json`: example documentation data.

## Running

```bash
npm install
```

Open this folder in VS Code, press `F5`, and choose the **Run Extension** configuration.

## Adding Hover Data

Add a new key to any JSON file inside `src/docs`.

```json
{
  "keyword": {
    "title": "Hover title",
    "description": "A short explanation.",
    "syntax": "keyword(value)",
    "example": "keyword(\"example\");"
  }
}
```

The key, such as `keyword`, is the editor text that triggers the hover.

## Validation

```bash
npm run check
```

## Packaging

```bash
npm run package
```
