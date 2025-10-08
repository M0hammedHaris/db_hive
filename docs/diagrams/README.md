# DB Hive Architecture Diagrams

This directory contains Mermaid diagram sources (`.mmd` files) and their rendered PNG outputs for the DB Hive frontend and system architecture.

## Files

### Architecture Diagrams
- **architecture.mmd** / **architecture.png** - High-level system architecture showing frontend, API layer, persistence, and external services
- **components.mmd** / **components.png** - Component diagram showing major frontend and backend components and their relationships

### Sequence Diagrams
- **sequences-run-query.mmd** / **sequences-run-query.png** - Run Query flow showing user interaction, API calls, and worker job processing
- **sequences-save-query.mmd** / **sequences-save-query.png** - Save Query + LLM suggestion flow showing how queries are saved with optional AI assistance
- **sequences.mmd** - Index file referencing the sequence diagrams

## Regenerating PNG Files

The PNG renders were produced using [mermaid-cli](https://github.com/mermaid-js/mermaid-cli).

### Prerequisites

Install mermaid-cli globally:

```bash
npm install -g @mermaid-js/mermaid-cli
```

### Regenerate All Diagrams

From the repository root:

```bash
# Regenerate architecture diagram
mmdc -i docs/diagrams/architecture.mmd -o docs/diagrams/architecture.png -w 784

# Regenerate components diagram
mmdc -i docs/diagrams/components.mmd -o docs/diagrams/components.png -w 784

# Regenerate sequence diagrams
mmdc -i docs/diagrams/sequences-run-query.mmd -o docs/diagrams/sequences-run-query.png -w 784
mmdc -i docs/diagrams/sequences-save-query.mmd -o docs/diagrams/sequences-save-query.png -w 784
```

### Regenerate All at Once

```bash
for file in docs/diagrams/*.mmd; do
  if [ "$(basename "$file")" != "sequences.mmd" ]; then
    mmdc -i "$file" -o "${file%.mmd}.png" -w 784
  fi
done
```

## Editing Diagrams

You can edit the `.mmd` files using:

1. **Mermaid Live Editor** - https://mermaid.live/ (paste the content to preview)
2. **VS Code** - Install the "Mermaid Preview" extension
3. **Any text editor** - Mermaid uses a simple text-based syntax

After editing, regenerate the PNG files using the commands above.

## Usage in Documentation

These diagrams are referenced in:
- `docs/frontend-architecture.md` - See the "Diagrams" section at the end

## Mermaid Syntax Reference

- [Mermaid Documentation](https://mermaid.js.org/)
- [Flowchart Syntax](https://mermaid.js.org/syntax/flowchart.html)
- [Sequence Diagram Syntax](https://mermaid.js.org/syntax/sequenceDiagram.html)
- [Class Diagram Syntax](https://mermaid.js.org/syntax/classDiagram.html)
