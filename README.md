# Dev Containers Notifier

Send native macOS notifications from your Dev Containers environment.

## Overview

Dev Containers Notifier is a VSCode extension that enables developers to send native macOS notifications from within a Dev Containers. This bridges the gap between containerized development environments and the host system's notification capabilities, making it perfect for long-running tasks, build completions, or any scenario where you need to be alerted from your remote development environment.

## Features

- **Native macOS Notifications**: Send native notifications from Dev Containers to your Mac
- **Customizable Sounds**: Choose from various macOS system sounds for your notifications
- **HTTP API**: Simple HTTP endpoint for easy integration with any tool or script
- **Configurable**: Port, sound, and enable/disable settings
- **Lightweight**: Minimal performance impact with a simple Express server

## Installation

### From VSCode Marketplace

1. Open VSCode
2. Go to Extensions (⇧⌘X)
3. Search for "Dev Containers Notifier"
4. Click Install

Or install directly from: [Marketplace](https://marketplace.visualstudio.com/items?itemName=touyu.devcontainers-notifier)

## Usage

### Basic Setup

1. Install the extension on your host VSCode (**not inside the Dev Container**)
2. The extension automatically starts when VSCode launches
3. From your Dev Containers, send notifications using HTTP POST requests

### Sending Notifications

Run `test-notification.sh` either on the host or inside the container:

```bash
sh scripts/test-notification.sh
```

Or send a POST request to the notification endpoint from within your Dev Containers:

```bash
curl -X POST http://host.docker.internal:3456/notify \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Dev Containers Notifier",
    "message": "[Test] Notifications from this extension are enabled!"
  }'
```

### Claude Code Hooks Integration

The repository includes ready-to-use scripts for Claude Code Hooks in the `/scripts` directory:

- [`claude-code-hooks-en.sh`](https://github.com/touyu/devcontainers-notifier/blob/main/scripts/claude-code-hooks-en.sh): English version of the notification hook
- [`claude-code-hooks-ja.sh`](https://github.com/touyu/devcontainers-notifier/blob/main/scripts/claude-code-hooks-ja.sh): Japanese version of the notification hook

These scripts can be used with Claude Code to send native macOS notifications when specific events occur. To use them with Claude Code:

1. Copy the script you want to use to your own project
2. Configure Claude Code to use the hook scripts
3. The scripts will automatically send notifications to your Mac when triggered

A sample Claude Code Hooks configuration can be found at [`/.claude/settings.json`](https://github.com/touyu/devcontainers-notifier/blob/main/.claude/settings.json) in this repository.

```json
{
  "hooks": {
	"Notification": [
      {
        "matcher": "",
        "hooks": [
          {
            "type": "command",
            "command": "sh scripts/claude-code-hooks-en.sh"
          }
        ]
      }
    ],
    "Stop": [
      {
        "matcher": "",
        "hooks": [
          {
            "type": "command",
            "command": "sh scripts/claude-code-hooks-en.sh"
          }
        ]
      }
    ]
  }
}
```

## Configuration

Configure the extension through VSCode settings:

| Setting | Type | Default | Description |
|---------|------|---------|-------------|
| `devcontainers-notifier.port` | number | 3456 | HTTP server port for notifications |
| `devcontainers-notifier.sound` | dropdown | "Funk" | macOS notification sound (select from dropdown) |
| `devcontainers-notifier.enabled` | boolean | true | Enable/disable for current workspace |

### Available Notification Sounds

`Basso`, `Blow`, `Bottle`, `Frog`, `Funk` (default), `Glass`, `Hero`, `Morse`, `Ping`, `Pop`, `Purr`, `Sosumi`, `Submarine`, `Tink`

## Architecture

```
┌─────────────────┐         ┌─────────────────┐
│   Dev Containers  │         │   Host macOS    │
│                 │  HTTP   │                 │
│  Your App/Script├────────►│ VSCode Extension│
│                 │ :3456   │                 │
└─────────────────┘         └────────┬────────┘
                                     │
                                     ▼
                            ┌─────────────────┐
                            │ macOS           │
                            │ Notification    │
                            │ Center          │
                            └─────────────────┘
```

## Development

### Building from Source

```bash
# Clone the repository
git clone https://github.com/touyu/devcontainers-notifier.git
cd devcontainers-notifier

# Install dependencies
npm install

# Package the extension
npm run package
```

### Local Development

1. Open the project in VSCode
2. Press F5 to launch a new VSCode instance with the extension loaded
3. Test the extension functionality

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

## Acknowledgments

- Built with [node-notifier](https://github.com/mikaelbr/node-notifier) for cross-platform notification support
- Inspired by the need for better Dev Containers integration with host systems

## Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/touyu/devcontainers-notifier/issues) page
2. Create a new issue if your problem isn't already listed
3. Provide as much detail as possible about your setup and the issue

---

Made with ❤️ for the Dev Containers community
