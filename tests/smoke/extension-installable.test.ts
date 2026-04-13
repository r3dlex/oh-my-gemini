import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { describe, expect, test } from 'vitest';

const packageRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '..',
  '..',
);

describe('smoke: native Gemini extension package layout', () => {
  test('publishes installable extension assets at the canonical oh-my-gemini extension root', () => {
    const extensionRoot = path.join(packageRoot, 'extensions', 'oh-my-gemini');
    const manifestPath = path.join(extensionRoot, 'gemini-extension.json');
    const rootManifestPath = path.join(packageRoot, 'gemini-extension.json');
    const contextFilePath = path.join(extensionRoot, 'GEMINI.md');
    const commandFiles = [
      path.join(extensionRoot, 'commands', 'omp', 'doctor.toml'),
      path.join(extensionRoot, 'commands', 'omp', 'setup.toml'),
      path.join(extensionRoot, 'commands', 'omp', 'team', 'run.toml'),
      path.join(extensionRoot, 'commands', 'omg', 'doctor.toml'),
      path.join(extensionRoot, 'commands', 'omg', 'team', 'run.toml'),
    ];

    expect(existsSync(manifestPath)).toBe(true);
    expect(existsSync(contextFilePath)).toBe(true);

    const manifest = JSON.parse(readFileSync(manifestPath, 'utf8')) as {
      contextFileName?: string;
      mcpServers?: Record<string, { command?: string; args?: string[] }>;
    };
    const rootManifest = JSON.parse(readFileSync(rootManifestPath, 'utf8')) as {
      mcpServers?: Record<string, { command?: string; args?: string[] }>;
    };

    expect(manifest.contextFileName).toBe('GEMINI.md');
    expect(manifest.mcpServers?.omp_cli_tools?.command).toBe('oh-my-gemini');
    expect(manifest.mcpServers?.omp_cli_tools?.args).toStrictEqual(['tools', 'serve']);
    expect(rootManifest.mcpServers?.omp_cli_tools?.command).toBe('oh-my-gemini');
    expect(rootManifest.mcpServers?.omp_cli_tools?.args).toStrictEqual(['tools', 'serve']);

    for (const commandFile of commandFiles) {
      expect(existsSync(commandFile)).toBe(true);
    }

    expect(existsSync(path.join(extensionRoot, 'agents'))).toBe(true);
    expect(existsSync(path.join(extensionRoot, 'skills'))).toBe(true);
  });
});
