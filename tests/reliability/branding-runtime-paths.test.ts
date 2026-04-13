import { existsSync, readFileSync } from 'node:fs';
import { promises as fs } from 'node:fs';
import path from 'node:path';

import { describe, expect, test } from 'vitest';

import {
  listTokenUsage,
  recordTokenUsage,
  summarizeTokenUsage,
} from '../../src/state/token-tracking.js';
import {
  readStopCallbackConfig,
  saveSessionSummary,
  writeStopCallbackConfig,
} from '../../src/notifications/index.js';
import { createTempDir, removeDir } from '../utils/runtime.js';

describe('reliability: canonical OMG runtime paths', () => {
  test('token tracking writes to .omg and reads legacy .omp fallback', async () => {
    const tempRoot = createTempDir('omg-token-tracking-');

    try {
      await recordTokenUsage(tempRoot, {
        sessionId: 'session-1',
        command: 'omg verify',
        provider: 'gemini',
        startedAt: '2026-04-13T00:00:00.000Z',
        completedAt: '2026-04-13T00:01:00.000Z',
        promptTokens: 10,
        responseTokens: 20,
      });

      const canonicalPath = path.join(tempRoot, '.omg', 'state', 'tokens', 'usage.ndjson');
      expect(existsSync(canonicalPath)).toBe(true);

      const legacyPath = path.join(tempRoot, '.omp', 'state', 'tokens', 'usage.ndjson');
      await fs.mkdir(path.dirname(legacyPath), { recursive: true });
      await fs.writeFile(
        legacyPath,
        `${JSON.stringify({
          sessionId: 'session-legacy',
          command: 'omp verify',
          provider: 'gemini',
          startedAt: '2026-04-12T00:00:00.000Z',
          completedAt: '2026-04-12T00:02:00.000Z',
          promptTokens: 5,
          responseTokens: 7,
        })}\n`,
        'utf8',
      );

      const canonicalRecords = await listTokenUsage(tempRoot);
      expect(canonicalRecords).toHaveLength(1);
      expect(canonicalRecords[0]?.sessionId).toBe('session-1');

      await fs.rm(path.join(tempRoot, '.omg'), { recursive: true, force: true });

      const legacyRecords = await listTokenUsage(tempRoot);
      expect(legacyRecords).toHaveLength(1);
      expect(legacyRecords[0]?.sessionId).toBe('session-legacy');

      const legacySummary = await summarizeTokenUsage(tempRoot, 'daily', new Date('2026-04-12T12:00:00.000Z'));
      expect(legacySummary.totalTokens).toBe(12);
    } finally {
      removeDir(tempRoot);
    }
  });

  test('notifications prefer .omg paths and can still read legacy stop-callback config', async () => {
    const tempRoot = createTempDir('omg-notifications-');

    try {
      await writeStopCallbackConfig(tempRoot, {
        enabled: true,
        tagList: ['release'],
      });

      const canonicalConfigPath = path.join(tempRoot, '.omg', 'notifications', 'stop-callbacks.json');
      expect(existsSync(canonicalConfigPath)).toBe(true);

      const summaryPath = await saveSessionSummary(tempRoot, {
        sessionId: 'session-2',
        status: 'completed',
        projectName: 'oh-my-gemini',
      });

      expect(summaryPath).toBe(path.join(tempRoot, '.omg', 'state', 'sessions', 'session-2.summary.json'));
      expect(existsSync(summaryPath)).toBe(true);
      expect(readFileSync(summaryPath, 'utf8')).toContain('oh-my-gemini');

      await fs.rm(path.join(tempRoot, '.omg'), { recursive: true, force: true });
      const legacyConfigPath = path.join(tempRoot, '.omp', 'notifications', 'stop-callbacks.json');
      await fs.mkdir(path.dirname(legacyConfigPath), { recursive: true });
      await fs.writeFile(
        legacyConfigPath,
        `${JSON.stringify({ enabled: true, tagList: ['legacy'] }, null, 2)}\n`,
        'utf8',
      );

      const config = await readStopCallbackConfig(tempRoot);
      expect(config?.tagList).toStrictEqual(['legacy']);
    } finally {
      removeDir(tempRoot);
    }
  });
});
