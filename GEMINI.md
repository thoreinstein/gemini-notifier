# Gemini Notifier - Context & Instructions

## Project Overview
This project, `gemini-notifier`, is a **Gemini CLI Extension**. 
Its purpose is to extend the capabilities of the Gemini CLI, presumably to handle notifications, though the specific logic is currently undefined.

## Architecture
The project is currently in a scaffolding state.
- **Manifest**: `gemini-extension.json` is the core configuration file defining the extension's metadata, tools, and system instructions.
- **Documentation**: `README.md` (Currently empty).

## Development Conventions

### Extension Manifest (`gemini-extension.json`)
The `gemini-extension.json` file is the source of truth for the extension. It requires the following structure to be functional:
```json
{
  "name": "gemini-notifier",
  "version": "1.0.0",
  "description": "Description of what the notifier does",
  "instructions": "System prompt instructions for the agent using this extension",
  "tools": [
    {
      "name": "tool_name",
      "description": "Tool description",
      "command": ["executable", "arg1"]
    }
  ]
}
```

### Next Steps
1.  Define the scope of "notification" (System notifications? Slack? Email?).
2.  Implement the logic scripts (e.g., Python, Bash, Go) that the extension will call.
3.  Register these scripts in `gemini-extension.json` under `tools`.
4.  Update `README.md` with installation and usage instructions.

## Building and Testing
- **Validation**: Ensure `gemini-extension.json` is valid JSON.
- **Installation**: Extensions are typically installed via `gemini install .` or by linking the directory in the global Gemini configuration.
