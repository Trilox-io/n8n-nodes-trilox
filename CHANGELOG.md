# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.0] - 2026-01-21

### Added
- Initial release of n8n-nodes-trilox
- **Trilox** node with 3 operations:
  - **Record Message**: Record messages to Trilox conversations
    - Support for bot and visitor sender types
    - Visitor metadata support
    - Dynamic app selection
  - **Check Handler**: Check conversation handler status
    - Returns handler type (bot, assigned_human, awaiting_human)
    - Returns conversation status (active, resolved, archived)
    - Use with Switch node for workflow routing
  - **Escalate to Human**: Escalate conversations to human agents
    - Optional escalation reason field
    - Seamless handover from bot to human
- **Trilox Trigger** node: Webhook trigger for human agent replies
  - Auto-configuration of webhook URL
  - Automatic registration/deregistration with Trilox API
  - Supports message types: text, image, file, audio, video
  - Media messages include file_url, file_name, file_size, file_mime_type
- **Trilox API** credentials: Secure API authentication
  - API key validation with read/write scopes
  - Configurable base URL for self-hosted instances
  - Connection testing

### Documentation
- Complete README with installation and usage examples
- Example workflows for common use cases
- Troubleshooting guide
- API documentation for all nodes

[0.1.0]: https://github.com/Trilox-io/n8n-nodes-trilox/releases/tag/v0.1.0
