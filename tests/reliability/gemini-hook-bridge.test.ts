import { describe, expect, test } from 'vitest';

import { runCli } from '../../src/cli/index.js';
import { executeHooksCommand } from '../../src/cli/commands/hooks.js';
import {
  buildHookContextFromGeminiPayload,
  executeGeminiHookBridge,
} from '../../src/hooks/gemini-bridge.js';
import type { CliIo } from '../../src/cli/types.js';
import type { HookContext, HookResult, RegisteredHook } from '../../src/hooks/types.js';

function createIoCapture(): {
  io: CliIo;
  stdout: string[];
  stderr: string[];
} {
  const stdout: string[] = [];
  const stderr: string[] = [];

  return {
    io: {
      stdout(message: string) {
        stdout.push(message);
      },
      stderr(message: string) {
        stderr.push(message);
      },
    },
    stdout,
    stderr,
  };
}

describe('reliability: Gemini hook bridge', () => {
  test('maps BeforeTool shell commands into internal permission requests', () => {
    const context = buildHookContextFromGeminiPayload({
      cwd: '/repo',
      event: 'BeforeTool',
      payload: {
        cwd: '/workspace',
        session_id: 'session-1',
        tool_name: 'run_shell_command',
        tool_input: {
          command: 'git status',
        },
      },
    });

    expect(context.cwd).toBe('/workspace');
    expect(context.event).toBe('PreToolUse');
    expect(context.permissionRequest).toBe('git status');
    expect(context.sessionId).toBe('session-1');
  });

  test('denies unsafe BeforeTool requests when permission handler reports manual review', async () => {
    const output = await executeGeminiHookBridge({
      cwd: '/repo',
      event: 'BeforeTool',
      payload: {
        tool_name: 'run_shell_command',
        tool_input: {
          command: 'rm -rf .',
        },
      },
      hooks: [] satisfies RegisteredHook[],
      runHookPipelineFn: async (context: HookContext) => {
        expect(context.permissionRequest).toBe('rm -rf .');
        return [
          {
            continue: true,
            warnings: ['manual review required'],
            data: { approved: false },
          },
        ];
      },
    });

    expect(output).toStrictEqual({
      decision: 'deny',
      reason: 'manual review required',
      systemMessage: 'manual review required',
    });
  });

  test('turns SessionStart system context into Gemini additionalContext', async () => {
    const output = await executeGeminiHookBridge({
      cwd: '/repo',
      event: 'SessionStart',
      payload: {
        source: 'startup',
      },
      hooks: [] satisfies RegisteredHook[],
      runHookPipelineFn: async () => [
        {
          continue: true,
          systemMessage: '## Project Memory\n- keep diffs small',
        } satisfies HookResult,
      ],
    });

    expect(output).toStrictEqual({
      hookSpecificOutput: {
        additionalContext: '## Project Memory\n- keep diffs small',
      },
      systemMessage: '## Project Memory\n- keep diffs small',
    });
  });

  test('hooks bridge subcommand prints JSON output from stdin payload', async () => {
    const ioCapture = createIoCapture();

    const result = await executeHooksCommand(
      ['bridge', '--event', 'BeforeAgent'],
      {
        cwd: process.cwd(),
        io: ioCapture.io,
        readStdin: async () => JSON.stringify({ prompt: 'keep going' }),
      },
    );

    expect(result.exitCode).toBe(0);
    expect(() => JSON.parse(ioCapture.stdout.join('\n'))).not.toThrow();
  });

  test('runCli dispatches injected hooks bridge dependencies', async () => {
    const ioCapture = createIoCapture();
    let stdinRead = false;

    const exitCode = await runCli(['hooks', 'bridge', '--event', 'BeforeAgent'], {
      io: ioCapture.io,
      hooks: {
        readStdin: async () => {
          stdinRead = true;
          return JSON.stringify({ prompt: 'summarize the current task' });
        },
      },
    });

    expect(exitCode).toBe(0);
    expect(stdinRead).toBe(true);
  });
});
