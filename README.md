# n8n-nodes-trilox

[![NPM Version](https://img.shields.io/npm/v/n8n-nodes-trilox)](https://www.npmjs.com/package/n8n-nodes-trilox)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![npm downloads](https://img.shields.io/npm/dt/n8n-nodes-trilox)](https://www.npmjs.com/package/n8n-nodes-trilox)

This is an n8n community node that lets you use [Trilox](https://trilox.io) in your workflows. Trilox is the first n8n chatbot inbox with human takeover. Monitor all conversations, take control from bots, and reply as a human. All your channels (WhatsApp, Telegram, Messenger) unified in one dashboard—built specifically for n8n developers.

[n8n](https://n8n.io/) is a fair-code licensed workflow automation platform.

## ✨ Features

- **Record Message**: Log bot and visitor messages to Trilox—automatically grouped into conversations for monitoring
- **Check Handler**: Prevent double replies by checking if a human is handling the conversation before your bot responds
- **Escalate to Human**: Transfer conversations to human agents when bots can't answer
- **Agent Message**: Webhook trigger that receives human agent replies so you can forward them to customers

Bring all your chatbot conversations into one dedicated dashboard. Monitor interactions in real-time and step in as a human whenever your customers need that personal touch.

## Installation

### Community Nodes (Recommended)

1. Go to **Settings > Community Nodes** in your n8n instance
2. Click **Install**
3. Enter `n8n-nodes-trilox`
4. Click **Install**

### Manual Installation

```bash
npm install n8n-nodes-trilox
```

For local development:
```bash
cd n8n-nodes-trilox
npm install
npm run build
npm link

cd ~/.n8n/custom
npm link n8n-nodes-trilox

# Restart n8n
n8n start
```

## Prerequisites

Before using these nodes, you need:

1. A Trilox account with at least one project
2. A Project API Key from Trilox Dashboard

### Getting Your API Key

1. Log in to your [Trilox Dashboard](https://app.trilox.io)
2. Navigate to **Project Settings → API Keys**
3. Click **Create API Key**
4. Name it (e.g., "n8n Integration")
5. Select scope: **read** (query only) or **write** (send messages, escalate)
6. Copy the key (format: `sk_proj_xxxxxxxxxxxxx`)
7. Save it securely (you won't see it again!)

## Nodes Included

This package includes 2 nodes with 4 operations:

### Trilox Node
Regular node for conversation management with 3 operations:
- **Record Message**: Record bot or visitor messages to conversations
- **Escalate to Human**: Request human takeover for bot conversations
- **Check Handler**: Check the current conversation handler status

### Trilox Trigger
Webhook trigger node:
- **Agent Message**: Triggered when a human agent sends a reply

## Usage

### Setting Up Credentials

1. Add a new credential in n8n
2. Search for **Trilox API**
3. Enter your Project API Key
4. (Optional) Change Base URL if self-hosting
5. Click **Test** to verify connection

### Example Workflow 1: Simple Bot with Human Handover

```
1. Webhook Trigger (receives incoming messages)
   ↓
2. Trilox Check Handler
   ├─ Bot Output → Continue bot conversation
   ├─ Assigned Human → Stop (human is handling)
   └─ Awaiting Human → Notify team
```

### Example Workflow 2: Conditional Escalation

```
1. Webhook Trigger
   ↓
2. IF (customer says "speak to human")
   ├─ True → Trilox Escalate
   └─ False → Trilox Record Message (bot response)
```

### Example Workflow 3: Receive and Forward Human Replies

```
1. Trilox Trigger (Agent Message event)
   ↓
2. Code Node (process agent reply)
   ↓
3. HTTP Request (forward to customer's WhatsApp)
```

## Node Details

### Trilox - Record Message

**Purpose**: Record messages to Trilox conversations

**Configuration**:
- **App**: Select the chat inbox (app)
- **Chat ID**: Unique conversation identifier (any non-empty string, 1-255 chars). Convention: `channel:id` (e.g., `whatsapp:1234567890`)
- **Sender Type**: Choose `bot` or `visitor`
- **Channel**: Communication channel (n8n Chat, Telegram, WhatsApp, Messenger, Instagram, Widget, API)
- **Message**: Message content (1-10,000 characters)
- **Visitor Name** (optional): Name when sender is visitor
- **Visitor Metadata** (optional): JSON metadata

**Example**:
```json
{
  "chatId": "whatsapp:1234567890",
  "senderType": "bot",
  "channel": "whatsapp",
  "message": "Hello! How can I help you today?"
}
```

**Output**:
```json
{
  "conversation_id": "uuid",
  "message_id": "uuid"
}
```

### Trilox - Check Handler

**Purpose**: Check conversation handler status (use with Switch node for routing)

**Configuration**:
- **App**: Select the chat inbox
- **Chat ID**: Conversation to check

**Output**: Returns a single output with handler information. Use a **Switch** node to route based on `handlerType`:
- `bot`: Conversation is handled by bot
- `assigned_human`: Human agent is assigned
- `awaiting_human`: Waiting for human agent

**Example Output**:
```json
{
  "id": "conv-uuid",
  "chatId": "whatsapp:1234567890",
  "handlerType": "bot",
  "status": "active",
  "assignedToId": null
}
```

**Status Values**: `active`, `resolved`, `archived`

### Trilox - Escalate to Human

**Purpose**: Escalate conversation to human agent

**Configuration**:
- **App**: Select the chat inbox
- **Chat ID**: Conversation to escalate
- **Escalation Reason** (optional): Context for human agents

**Example**:
```json
{
  "chatId": "whatsapp:1234567890",
  "reason": "Customer needs refund assistance"
}
```

**Output**:
```json
{
  "id": "conv-uuid",
  "handlerType": "awaiting_human",
  "handoverRequestedAt": "2025-01-15T10:30:00Z",
  "handoverReason": "Customer needs refund assistance"
}
```

### Trilox Trigger - Agent Message

**Purpose**: Webhook trigger that receives human agent replies from Trilox

**Configuration**:
- **App**: Select the chat inbox to receive replies from

**How It Works**:
1. n8n automatically generates a unique webhook URL
2. Node registers this URL with Trilox when workflow is activated
3. When human agents reply in Trilox, webhook is triggered
4. Workflow receives the agent's message and can forward it to customer

**Webhook Payload Example**:
```json
{
  "conversation_id": "uuid",
  "chat_id": "whatsapp:1234567890",
  "channel": "whatsapp",
  "message": "Agent's reply text",
  "sender_name": "Jane Smith",
  "sender_id": "uuid",
  "message_id": "uuid",
  "type": "text"
}
```

**Supported Message Types**: `text`, `image`, `file`, `audio`, `video`

**Media Message Example** (for image/file/audio/video types):
```json
{
  "conversation_id": "uuid",
  "chat_id": "whatsapp:1234567890",
  "channel": "whatsapp",
  "message": "Image caption",
  "sender_name": "Jane Smith",
  "sender_id": "uuid",
  "message_id": "uuid",
  "type": "image",
  "file_url": "https://cdn.example.com/image.png",
  "file_name": "image.png",
  "file_size": 245632,
  "file_mime_type": "image/png"
}
```

**Note**: Webhook delivery has no automatic retries. Failed deliveries can be manually retried from the Trilox dashboard.

## Rate Limits

- **API Endpoints**: 10,000 requests/hour per API key
- **Webhook Endpoints**: 1,000 requests/hour per app

When rate limit is exceeded, you'll receive a `429 Too Many Requests` response.

## Error Handling

All nodes support n8n's **Continue On Fail** option:
- Enable to continue workflow even if node fails
- Failed items will output error information
- Useful for batch processing

### API Error Response Format

```json
{
  "success": false,
  "error": "Error category",
  "message": "User-friendly explanation"
}
```

**HTTP Status Codes**:
| Code | Meaning |
|------|---------|
| 400 | Validation error (missing/invalid field) |
| 401 | Unauthorized (invalid API key) |
| 403 | Forbidden (no access to resource) |
| 404 | Resource not found |
| 429 | Rate limit exceeded |
| 500 | Server error |

## Troubleshooting

### "API key required"
- Ensure you've added Trilox API credentials
- Verify the credential is selected in the node
- Check that your API key starts with `sk_proj_`

### "Invalid API key"
- Your API key may be revoked or expired
- Generate a new key in Trilox Dashboard
- Update the credential in n8n

### "Rate limit exceeded"
- Wait for the rate limit window to reset
- Reduce workflow execution frequency
- Check for infinite loops in your workflow

### "Conversation not found"
- Verify the chat ID exists in Trilox
- Ensure you're using the correct app
- Check that the conversation isn't deleted

### Dropdowns Not Loading
- Test your credential connection
- Verify your API key has access to projects
- Check your internet connection

## Best Practices

### Security
- Store API keys in n8n credentials (never hardcode)
- Use read-only API keys when possible
- Rotate keys quarterly
- Never commit keys to version control

### Performance
- Use batch operations when possible
- Implement error handling
- Monitor rate limits
- Cache frequently accessed data

### Workflow Design
- Use the Check Handler node to avoid duplicate responses
- Add escalation timeouts for critical conversations
- Log important events to external systems
- Test workflows before deploying to production

## Support

- **Documentation**: [https://github.com/Trilox-io/n8n-nodes-trilox#readme](https://github.com/Trilox-io/n8n-nodes-trilox#readme)
- **GitHub Issues**: [https://github.com/Trilox-io/n8n-nodes-trilox/issues](https://github.com/Trilox-io/n8n-nodes-trilox/issues)
- **Email**: support@trilox.io

## License

MIT

## Version History

### 0.1.0 (Initial Release)
- **Trilox node** with 3 operations:
  - Record Message
  - Escalate to Human
  - Check Handler
- **Trilox Trigger node** (webhook trigger for agent messages)
- **Trilox API credential**

## Contributing

Contributions are welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## About Trilox

Trilox is the first n8n chatbot inbox with human takeover. Monitor all your chatbot conversations, take control from bots when needed, and reply as a human. Built by an automation engineer, for n8n developers.

Learn more at [trilox.io](https://trilox.io)
