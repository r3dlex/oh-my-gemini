import { describe, expect, test } from 'vitest';

import {
  buildInternalHookContext,
  convertHookResultToGeminiOutput,
  executeGeminiHookBridge,
  mapGeminiHookEventToInternalEvent,
} from '../../src/hooks/bridge.js';
import type { HookResult, RegisteredHook } from '../../src/hooks/types.js';

describe('reliability: Gemini hook bridge', () => {
  test('maps Gemini CLI event names to the internal hook registry', () => {
    expect(mapGeminiHookEventToInternalEvent('BeforeAgent')).toBe('UserPromptSubmit');
    expect(mapGeminiHookEventToInternalEvent('BeforeTool')).toBe('PreToolUse');
    expect(mapGeminiHookEventToInternalEvent('AfterTool')).toBe('PostToolUse');
    expect(mapGeminiHookEventToInternalEvent('SessionStart')).toBe('SessionStart');
    expect(mapGeminiHookEventToInternalEvent('SessionEnd')).toBe('SessionEnd');
    expect(mapGeminiHookEventToInternalEvent('PreCompress')).toBe('PreCompact');
    expect(mapGeminiHookEventToInternalEvent('AfterAgent')).toBeNull();
  });

  test('converts shell tool payloads into internal pre-tool permission requests', () => {
    const context = buildInternalHookContext('/tmp/project', {
      cwd: '/tmp/project',
      session_id: 'session-1',
      hook_event_name: 'BeforeTool',
      tool_name: 'run_shell_command',
      tool_input: {
        command: 'npm test',
      },
    });

    expect(context).toMatchObject({
      cwd: '/tmp/project',
      event: 'PreToolUse',
      sessionId: 'session-1',
      permissionRequest: 'npm test',
      toolName: 'run_shell_command',
    });
  });

  test('injects additional context for prompt-side hook results', () => {
    const output = convertHookResultToGeminiOutput('UserPromptSubmit', {
      continue: true,
      systemMessage: 'Project Memory\n- keep diffs small',
      message: 'Keyword detector routed prompt to ralph.',
      warnings: ['No learned patterns matched this task yet.'],
    });

    expect(output.systemMessage).toContain('Project Memory');
    expect(output.hookSpecificOutput?.additionalContext).toContain('keep diffs small');
    expect(output.hookSpecificOutput?.additionalContext).toContain('Keyword detector routed');
  });

  test('bridges unsafe shell commands into a deny decision via the internal permission hook', async () => {
    const output = await executeGeminiHookBridge({
      cwd: process.cwd(),
      payload: {
        cwd: process.cwd(),
        hook_event_name: 'BeforeTool',
        tool_name: 'run_shell_command',
        tool_input: {
          command: 'rm -rf /tmp/nope',
        },
      },
    });

    expect(output.decision).toBe('deny');
    expect(output.reason).toMatch(/manual review/i);
  });

  test('supports custom hook registries for deterministic hook-event translation', async () => {
    const hooks: RegisteredHook[] = [
      {
        name: 'bridge-test',
        events: ['PostToolUse'],
        priority: 1,
        async handler() {
          const result: HookResult = {
            continue: true,
            systemMessage: 'append this to the tool result',
          };
          return result;
        },
      },
    ];

    const output = await executeGeminiHookBridge({
      cwd: process.cwd(),
      payload: {
        cwd: process.cwd(),
        hook_event_name: 'AfterTool',
        tool_name: 'read_file',
        tool_input: { path: 'README.md' },
        tool_response: { returnDisplay: 'ok' },
      },
      hooks,
    });

    expect(output.hookSpecificOutput?.additionalContext).toContain('append this to the tool result');
  });
});
