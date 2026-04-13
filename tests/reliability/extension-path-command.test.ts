import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';

import { afterEach, describe, expect, test } from 'vitest';

import { executeExtensionPathCommand } from '../../src/cli/commands/extension-path.js';
import type { CliIo } from '../../src/cli/types.js';

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

function writeManifest(root: string): string {
  mkdirSync(root, { recursive: true });
  const manifestPath = path.join(root, 'gemini-extension.json');
  writeFileSync(
    manifestPath,
    JSON.stringify({ name: 'oh-my-gemini', version: '1.0.0', contextFileName: 'GEMINI.md' }),
  );
  return manifestPath;
}

const tempDirs: string[] = [];

function makeTempDir(prefix: string): string {
  const dir = mkdtempSync(path.join(tmpdir(), prefix));
  tempDirs.push(dir);
  return dir;
}

afterEach(() => {
  while (tempDirs.length > 0) {
    const dir = tempDirs.pop();
    if (dir) rmSync(dir, { recursive: true, force: true });
  }
});

describe('reliability: extension path command', () => {
  test('help prints OMG-first environment override guidance', async () => {
    const ioCapture = createIoCapture();

    const result = await executeExtensionPathCommand(['--help'], {
      cwd: process.cwd(),
      io: ioCapture.io,
    });

    expect(result.exitCode).toBe(0);
    expect(ioCapture.stdout.join('\n')).toContain('OMG_EXTENSION_PATH');
    expect(ioCapture.stdout.join('\n')).toContain('OMP_EXTENSION_PATH');
  });

  test('unknown options return usage error', async () => {
    const ioCapture = createIoCapture();

    const result = await executeExtensionPathCommand(['--bad'], {
      cwd: process.cwd(),
      io: ioCapture.io,
    });

    expect(result.exitCode).toBe(2);
    expect(ioCapture.stderr.join('\n')).toContain('--bad');
    expect(ioCapture.stdout.join('\n')).toContain('Usage: omp extension path');
  });

  test('unexpected positional arguments return usage error', async () => {
    const ioCapture = createIoCapture();

    const result = await executeExtensionPathCommand(['extra-positional'], {
      cwd: process.cwd(),
      io: ioCapture.io,
    });

    expect(result.exitCode).toBe(2);
    expect(ioCapture.stderr.join('\n')).toContain('Unexpected positional arguments');
  });

  test('invalid explicit override reports actionable error', async () => {
    const cwd = makeTempDir('omg-ext-invalid-');
    const ioCapture = createIoCapture();

    const result = await executeExtensionPathCommand(
      ['--extension-path', 'missing-extension-root'],
      {
        cwd,
        io: ioCapture.io,
      },
    );

    expect(result.exitCode).toBe(1);
    expect(ioCapture.stderr.join('\n')).toContain('Explicit extension override is invalid');
    expect(ioCapture.stderr.join('\n')).toContain('OMG_EXTENSION_PATH');
  });

  test('plain output prefers relative cwd path when canonical extension exists locally', async () => {
    const ioCapture = createIoCapture();

    const result = await executeExtensionPathCommand(
      ['--extension-path', 'extensions/oh-my-gemini'],
      {
        cwd: process.cwd(),
        io: ioCapture.io,
      },
    );

    expect(result.exitCode).toBe(0);
    expect(ioCapture.stdout[0]).toBe(path.join('extensions', 'oh-my-gemini'));
  });

  test('json output reports resolved source and manifest path', async () => {
    const cwd = makeTempDir('omg-ext-json-');
    const extensionRoot = path.join(cwd, 'custom-extension');
    const manifestPath = writeManifest(extensionRoot);
    const ioCapture = createIoCapture();

    const result = await executeExtensionPathCommand(['--json'], {
      cwd,
      env: {
        ...process.env,
        OMG_EXTENSION_PATH: extensionRoot,
      },
      io: ioCapture.io,
    });

    expect(result.exitCode).toBe(0);
    const payload = JSON.parse(ioCapture.stdout[0] ?? '{}') as {
      source?: string;
      path?: string;
      manifestPath?: string;
    };
    expect(payload.source).toBe('override');
    expect(payload.path).toBe(extensionRoot);
    expect(payload.manifestPath).toBe(manifestPath);
  });
});
