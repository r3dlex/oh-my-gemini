---
name: configure-notifications
aliases: ["/configure-notifications", "notifications", "notify setup"]
primaryRole: writer
description: Configure notification delivery for Slack, Discord, or Telegram. Use when a user wants to set up or verify notifications.
---

# Configure Notifications (oh-my-gemini)

## Quick Start

- Pick a platform, update the matching notifier module, then send a safe test notification.

Use this skill when a user wants to configure or verify notifications.

## Quick Start
- Slack webhook
- Discord webhook
- Telegram bot message

## Canonical implementation
- `src/notifications/webhook.ts`
- `src/notifications/discord.ts`
- `src/notifications/telegram.ts`
- `src/notifications/index.ts`

## Verification
After configuration, send a safe test notification and confirm the platform-specific validator passes.
