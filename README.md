# DevContainer Notifier

Send native macOS notifications from your DevContainer environment.

## Overview

DevContainer Notifier is a VSCode extension that enables developers to send native macOS notifications from within a DevContainer. This bridges the gap between containerized development environments and the host system's notification capabilities, making it perfect for long-running tasks, build completions, or any scenario where you need to be alerted from your remote development environment.

## Features

- 🔔 **Native macOS Notifications**: Send beautiful native notifications from DevContainer to your Mac
- 🎵 **Customizable Sounds**: Choose from various macOS system sounds for your notifications
- 🌐 **HTTP API**: Simple HTTP endpoint for easy integration with any tool or script
- ⚙️ **Configurable**: Per-workspace settings for port, sound, and enable/disable
- 🚀 **Lightweight**: Minimal performance impact with a simple Express server

## Installation

### From VSCode Marketplace

1. Open VSCode
2. Go to Extensions (⇧⌘X)
3. Search for "DevContainer Notifier"
4. Click Install

### From VSIX file

```bash
code --install-extension devcontainer-notifier-0.0.1.vsix
```

## Usage

### Basic Setup

1. Install the extension on your host VSCode (not inside the DevContainer)
2. The extension automatically starts when VSCode launches
3. From your DevContainer, send notifications using HTTP POST requests

### Sending Notifications

Send a POST request to the notification endpoint from within your DevContainer:

```bash
curl -X POST http://host.docker.internal:3456/notify \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Build Complete",
    "message": "Your project has been built successfully!"
  }'
```

### Example: Python

```python
import requests

def notify(title, message):
    requests.post('http://host.docker.internal:3456/notify', 
                 json={'title': title, 'message': message})

# Usage
notify("Test Complete", "All tests passed!")
```

### Example: Node.js

```javascript
const axios = require('axios');

async function notify(title, message) {
    await axios.post('http://host.docker.internal:3456/notify', {
        title,
        message
    });
}

// Usage
notify("Deploy Complete", "Application deployed successfully!");
```

### DevContainer Configuration

Add this to your `.devcontainer/devcontainer.json` to expose the notification service:

```json
{
  "forwardPorts": [3456],
  "postCreateCommand": "echo 'Notification service available at http://host.docker.internal:3456'"
}
```

## Configuration

Configure the extension through VSCode settings:

| Setting | Type | Default | Description |
|---------|------|---------|-------------|
| `devcontainer-notifier.port` | number | 3456 | HTTP server port for notifications |
| `devcontainer-notifier.sound` | string | "Funk" | macOS notification sound |
| `devcontainer-notifier.enabled` | boolean | true | Enable/disable for current workspace |

### Available Notification Sounds

- Basso
- Blow
- Bottle
- Frog
- Funk (default)
- Glass
- Hero
- Morse
- Ping
- Pop
- Purr
- Sosumi
- Submarine
- Tink

## Architecture

```
┌─────────────────┐         ┌─────────────────┐
│   DevContainer  │         │   Host macOS    │
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

## Security Considerations

- The HTTP server binds to `0.0.0.0:3456` by default
- Only use this extension in trusted development environments
- Consider configuring firewall rules if needed
- The extension only accepts POST requests to `/notify`

## Development

### Building from Source

```bash
# Clone the repository
git clone https://github.com/touyu/devcontainer-notifier.git
cd devcontainer-notifier

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

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

## Acknowledgments

- Built with [node-notifier](https://github.com/mikaelbr/node-notifier) for cross-platform notification support
- Inspired by the need for better DevContainer integration with host systems

## Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/touyu/devcontainer-notifier/issues) page
2. Create a new issue if your problem isn't already listed
3. Provide as much detail as possible about your setup and the issue

---

Made with ❤️ for the DevContainer community