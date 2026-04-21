import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';

import { describe, expect, test } from 'vitest';

import { maybeCheckAndPromptForUpdate } from '../../src/cli/auto-update.js';
import type { CliIo } from '../../src/cli/types.js';

function createIoCapture(): { io: CliIo; stdout: string[]; stderr: string[] } {
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

describe('reliability: launch-time auto-update prompt', () => {
  test('accept path runs global update and setup refresh', async () => {
    const cwd = await mkdtemp(path.join(tmpdir(), 'omg-auto-update-'));
    const ioCapture = createIoCapture();
    const prompts: string[] = [];
    let updateAttempts = 0;
    let setupRefreshes = 0;

    try {
      await maybeCheckAndPromptForUpdate(
        {
          cwd,
          env: {},
          command: 'launch',
          io: ioCapture.io,
        },
        {
          isInteractive: () => true,
          nowMs: () => Date.parse('2026-04-17T10:00:00.000Z'),
          resolvePackageName: async () => '@r3dlex/oh-my-gemini',
          resolveCurrentVersion: async () => '1.0.0',
          fetchLatestVersion: async () => '1.1.0',
          askYesNo: async (question) => {
            prompts.push(question);
            return true;
          },
          runGlobalUpdate: async () => {
            updateAttempts += 1;
          },
          refreshSetupAfterUpdate: async () => {
            setupRefreshes += 1;
          },
        },
      );

      const persisted = JSON.parse(
        await readFile(path.join(cwd, '.omg', 'state', 'update-check.json'), 'utf8'),
      ) as { last_seen_latest?: string };

      expect(updateAttempts).toBe(1);
      expect(setupRefreshes).toBe(1);
      expect(prompts[0]).toContain('Update available: v1.0.0 → v1.1.0');
      expect(ioCapture.stderr).toStrictEqual([]);
      expect(ioCapture.stdout).toContain(
        '[omg] Running: npm install -g @r3dlex/oh-my-gemini@latest',
      );
      expect(ioCapture.stdout).toContain(
        '[omg] Updated to v1.1.0. Restart to use the new version.',
      );
      expect(persisted.last_seen_latest).toBe('1.1.0');
    } finally {
      await rm(cwd, { recursive: true, force: true });
    }
  });

  test('decline path skips update and setup refresh', async () => {
    const cwd = await mkdtemp(path.join(tmpdir(), 'omg-auto-update-'));
    let updateAttempts = 0;
    let setupRefreshes = 0;

    try {
      await maybeCheckAndPromptForUpdate(
        {
          cwd,
          env: {},
          command: 'launch',
          io: createIoCapture().io,
        },
        {
          isInteractive: () => true,
          nowMs: () => Date.parse('2026-04-17T10:00:00.000Z'),
          resolvePackageName: async () => '@r3dlex/oh-my-gemini',
          resolveCurrentVersion: async () => '1.0.0',
          fetchLatestVersion: async () => '1.1.0',
          askYesNo: async () => false,
          runGlobalUpdate: async () => {
            updateAttempts += 1;
          },
          refreshSetupAfterUpdate: async () => {
            setupRefreshes += 1;
          },
        },
      );

      expect(updateAttempts).toBe(0);
      expect(setupRefreshes).toBe(0);
    } finally {
      await rm(cwd, { recursive: true, force: true });
    }
  });

  test('skip path ignores auto-update for help/version/update command flows', async () => {
    const cwd = await mkdtemp(path.join(tmpdir(), 'omg-auto-update-'));
    const checksByCommand = new Map<string, number>();

    try {
      for (const command of ['help', 'version', 'update']) {
        await maybeCheckAndPromptForUpdate(
          {
            cwd,
            env: {},
            command,
            io: createIoCapture().io,
          },
          {
            isInteractive: () => true,
            fetchLatestVersion: async () => {
              checksByCommand.set(command, (checksByCommand.get(command) ?? 0) + 1);
              return '1.1.0';
            },
          },
        );
      }

      expect(checksByCommand.size).toBe(0);
    } finally {
      await rm(cwd, { recursive: true, force: true });
    }
  });

  test('cache path throttles repeated checks within the TTL window', async () => {
    const cwd = await mkdtemp(path.join(tmpdir(), 'omg-auto-update-'));
    let checks = 0;
    let now = Date.parse('2026-04-17T10:00:00.000Z');

    try {
      const deps = {
        isInteractive: () => true,
        nowMs: () => now,
        resolvePackageName: async () => '@r3dlex/oh-my-gemini',
        resolveCurrentVersion: async () => '1.0.0',
        fetchLatestVersion: async () => {
          checks += 1;
          return '1.0.0';
        },
        askYesNo: async () => true,
      };

      await maybeCheckAndPromptForUpdate(
        {
          cwd,
          env: {},
          command: 'launch',
          io: createIoCapture().io,
        },
        deps,
      );

      now += 60_000; // 1 minute later, still below the 12h TTL.

      await maybeCheckAndPromptForUpdate(
        {
          cwd,
          env: {},
          command: 'launch',
          io: createIoCapture().io,
        },
        deps,
      );

      expect(checks).toBe(1);
    } finally {
      await rm(cwd, { recursive: true, force: true });
    }
  });

  test('disable env var bypasses checks', async () => {
    const cwd = await mkdtemp(path.join(tmpdir(), 'omg-auto-update-'));
    let checks = 0;

    try {
      await maybeCheckAndPromptForUpdate(
        {
          cwd,
          env: { OMG_AUTO_UPDATE: '0' },
          command: 'launch',
          io: createIoCapture().io,
        },
        {
          isInteractive: () => true,
          fetchLatestVersion: async () => {
            checks += 1;
            return '1.1.0';
          },
        },
      );

      expect(checks).toBe(0);
    } finally {
      await rm(cwd, { recursive: true, force: true });
    }
  });
});
