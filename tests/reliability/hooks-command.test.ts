import { describe, expect, test } from 'vitest';

import {
  buildHookContextFromGeminiInput,
  dispatchGeminiHook,
  mapGeminiHookEventName,
} from '../../src/cli/commands/hooks.js';
import type { RegisteredHook } from '../../src/hooks/index.js';

describe('reliability: hooks command bridge', () => {
  test('maps supported Gemini hook events onto internal hook events', () => {
    expect(mapGeminiHookEventName('SessionStart')).toBe('SessionStart');
    expect(mapGeminiHookEventName('BeforeAgent')).toBe('UserPromptSubmit');
    expect(mapGeminiHookEventName('BeforeTool')).toBe('PreToolUse');
    expect(mapGeminiHookEventName('AfterTool')).toBe('PostToolUse');
    expect(mapGeminiHookEventName('PreCompress')).toBe('PreCompact');
    expect(mapGeminiHookEventName('AfterAgent')).toBeNull();
  });

  test('builds hook context from Gemini CLI payloads', () => {
    const context = buildHookContextFromGeminiInput({
      cwd: '/tmp/workspace',
      eventName: 'BeforeTool',
      payload: {
        session_id: 'session-1',
        workspace_path: '/tmp/override',
        tool_name: 'run_shell_command',
        tool_input: {
          command: 'git status',
        },
      },
    });

    expect(context).toMatchObject({
      cwd: '/tmp/override',
      event: 'PreToolUse',
      sessionId: 'session-1',
      toolName: 'run_shell_command',
      permissionRequest: 'git status',
    });
  });

  test('dispatchGeminiHook exposes additional context for session and prompt hooks', async () => {
    const registry: RegisteredHook[] = [
      {
        name: 'session-bridge',
        events: ['SessionStart', 'UserPromptSubmit'],
        handler: async () => ({
          continue: true,
          systemMessage: 'project memory summary',
          warnings: ['legacy warning'],
        }),
      },
    ];

    const output = await dispatchGeminiHook({
      cwd: '/tmp/workspace',
      eventName: 'BeforeAgent',
      payload: {
        hook_event_name: 'BeforeAgent',
        prompt: 'plan this task',
      },
      registry,
    });

    expect(output.systemMessage).toContain('project memory summary');
    expect(output.systemMessage).toContain('legacy warning');
    expect(output.hookSpecificOutput?.additionalContext).toContain('project memory summary');
  });

  test('dispatchGeminiHook no-ops unsupported Gemini-only events', async () => {
    const output = await dispatchGeminiHook({
      cwd: '/tmp/workspace',
      eventName: 'AfterAgent',
      payload: {},
    });

    expect(output).toStrictEqual({});
  });
});
