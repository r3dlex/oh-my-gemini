import { promises as fs } from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { createInterface } from 'node:readline/promises';

import { runSetup } from '../installer/index.js';
import { readPersistedSetupScope } from '../installer/scopes.js';
import { runNpmGlobalUpdate, resolveUpdatePackageName } from './commands/update.js';
import type { CliIo } from './types.js';

interface UpdateCheckState {
  last_checked_at: string;
  last_seen_latest?: string;
}

interface LatestPackageInfo {
  version?: string;
}

interface InstalledPackageMetadata {
  name?: string;
  version?: string;
}

interface AutoUpdateStateDependencies {
  readUpdateState: (cwd: string, env: NodeJS.ProcessEnv) => Promise<UpdateCheckState | null>;
  writeUpdateState: (cwd: string, env: NodeJS.ProcessEnv, state: UpdateCheckState) => Promise<void>;
}

interface AutoUpdateNetworkDependencies {
  fetchLatestVersion: (packageName: string) => Promise<string | null>;
}

interface AutoUpdatePromptDependencies {
  askYesNo: (question: string) => Promise<boolean>;
  runGlobalUpdate: (input: {
    cwd: string;
    env: NodeJS.ProcessEnv;
    packageName: string;
  }) => Promise<void>;
  refreshSetupAfterUpdate: (input: {
    cwd: string;
    io: CliIo;
  }) => Promise<void>;
}

interface AutoUpdateRuntimeDependencies {
  nowMs: () => number;
  isInteractive: () => boolean;
  resolvePackageName: () => Promise<string>;
  resolveCurrentVersion: () => Promise<string | null>;
}

export interface AutoUpdateDependencies extends
  AutoUpdateStateDependencies,
  AutoUpdateNetworkDependencies,
  AutoUpdatePromptDependencies,
  AutoUpdateRuntimeDependencies {}

export interface MaybeCheckAndPromptForUpdateInput {
  cwd: string;
  env: NodeJS.ProcessEnv;
  command: string;
  io: CliIo;
}

const AUTO_UPDATE_CHECK_INTERVAL_MS = 12 * 60 * 60 * 1000; // 12h
const AUTO_UPDATE_DISABLE_VALUES = new Set(['0', 'false', 'no', 'off']);
const AUTO_UPDATE_SKIP_COMMANDS = new Set(['help', 'version', 'update']);

function parseSemver(version: string): [number, number, number] | null {
  const match = version.trim().match(/^v?(\d+)\.(\d+)\.(\d+)$/);
  if (!match) {
    return null;
  }

  return [Number(match[1]), Number(match[2]), Number(match[3])];
}

export function isNewerVersion(current: string, latest: string): boolean {
  const currentSemver = parseSemver(current);
  const latestSemver = parseSemver(latest);

  if (!currentSemver || !latestSemver) {
    return false;
  }

  if (latestSemver[0] !== currentSemver[0]) {
    return latestSemver[0] > currentSemver[0];
  }

  if (latestSemver[1] !== currentSemver[1]) {
    return latestSemver[1] > currentSemver[1];
  }

  return latestSemver[2] > currentSemver[2];
}

export function shouldCheckForUpdates(
  nowMs: number,
  state: UpdateCheckState | null,
  intervalMs = AUTO_UPDATE_CHECK_INTERVAL_MS,
): boolean {
  if (!state?.last_checked_at) {
    return true;
  }

  const previousCheckedAtMs = Date.parse(state.last_checked_at);
  if (!Number.isFinite(previousCheckedAtMs)) {
    return true;
  }

  return nowMs - previousCheckedAtMs >= intervalMs;
}

export function shouldSkipAutoUpdateForCommand(command: string): boolean {
  return AUTO_UPDATE_SKIP_COMMANDS.has(command.toLowerCase());
}

export function isAutoUpdateDisabled(env: NodeJS.ProcessEnv): boolean {
  const rawValue = env.OMG_AUTO_UPDATE ?? env.OMP_AUTO_UPDATE;
  if (!rawValue) {
    return false;
  }

  return AUTO_UPDATE_DISABLE_VALUES.has(rawValue.trim().toLowerCase());
}

function resolveStateRoot(cwd: string, env: NodeJS.ProcessEnv): string {
  const configuredRoot = env.OMG_STATE_ROOT ?? env.OMP_STATE_ROOT ?? path.join('.omp', 'state');
  return path.isAbsolute(configuredRoot)
    ? configuredRoot
    : path.resolve(cwd, configuredRoot);
}

function getUpdateStatePath(cwd: string, env: NodeJS.ProcessEnv): string {
  return path.join(resolveStateRoot(cwd, env), 'update-check.json');
}

async function readUpdateState(cwd: string, env: NodeJS.ProcessEnv): Promise<UpdateCheckState | null> {
  const statePath = getUpdateStatePath(cwd, env);

  try {
    const raw = await fs.readFile(statePath, 'utf8');
    return JSON.parse(raw) as UpdateCheckState;
  } catch (error) {
    const err = error as NodeJS.ErrnoException;
    if (err.code === 'ENOENT' || error instanceof SyntaxError) {
      return null;
    }
    throw error;
  }
}

async function writeUpdateState(
  cwd: string,
  env: NodeJS.ProcessEnv,
  state: UpdateCheckState,
): Promise<void> {
  const statePath = getUpdateStatePath(cwd, env);
  await fs.mkdir(path.dirname(statePath), { recursive: true });
  await fs.writeFile(statePath, `${JSON.stringify(state, null, 2)}\n`, 'utf8');
}

async function fetchLatestVersion(packageName: string, timeoutMs = 3_500): Promise<string | null> {
  const packagePath = encodeURIComponent(packageName);
  const registryUrl = `https://registry.npmjs.org/${packagePath}/latest`;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(registryUrl, { signal: controller.signal });
    if (!response.ok) {
      return null;
    }

    const parsed = (await response.json()) as LatestPackageInfo;
    return typeof parsed.version === 'string' ? parsed.version : null;
  } catch {
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

function loadInstalledPackageMetadata(): InstalledPackageMetadata {
  try {
    const require = createRequire(import.meta.url);
    return require('../../package.json') as InstalledPackageMetadata;
  } catch {
    return {};
  }
}

async function resolvePackageName(): Promise<string> {
  return resolveUpdatePackageName(loadInstalledPackageMetadata());
}

async function resolveCurrentVersion(): Promise<string | null> {
  const packageMetadata = loadInstalledPackageMetadata();
  return typeof packageMetadata.version === 'string' ? packageMetadata.version : null;
}

async function askYesNo(question: string): Promise<boolean> {
  const rl = createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  try {
    const answer = (await rl.question(question)).trim().toLowerCase();
    return answer === '' || answer === 'y' || answer === 'yes';
  } finally {
    rl.close();
  }
}

async function refreshSetupAfterUpdate(input: { cwd: string }): Promise<void> {
  const persistedScope = await readPersistedSetupScope(input.cwd);
  await runSetup({
    cwd: input.cwd,
    scope: persistedScope,
  });
}

const defaultDependencies: AutoUpdateDependencies = {
  nowMs: () => Date.now(),
  isInteractive: () => Boolean(process.stdin.isTTY && process.stdout.isTTY),
  resolvePackageName,
  resolveCurrentVersion,
  readUpdateState,
  writeUpdateState,
  fetchLatestVersion,
  askYesNo,
  runGlobalUpdate: async ({ cwd, env, packageName }) => {
    await runNpmGlobalUpdate({
      cwd,
      env,
      packageName,
    });
  },
  refreshSetupAfterUpdate: async ({ cwd }) => {
    await refreshSetupAfterUpdate({ cwd });
  },
};

export async function maybeCheckAndPromptForUpdate(
  input: MaybeCheckAndPromptForUpdateInput,
  dependencies: Partial<AutoUpdateDependencies> = {},
): Promise<void> {
  const autoUpdateDependencies: AutoUpdateDependencies = {
    ...defaultDependencies,
    ...dependencies,
  };

  if (isAutoUpdateDisabled(input.env)) {
    return;
  }

  if (shouldSkipAutoUpdateForCommand(input.command)) {
    return;
  }

  if (!autoUpdateDependencies.isInteractive()) {
    return;
  }

  const nowMs = autoUpdateDependencies.nowMs();
  const state = await autoUpdateDependencies.readUpdateState(input.cwd, input.env);
  if (!shouldCheckForUpdates(nowMs, state)) {
    return;
  }

  const packageName = await autoUpdateDependencies.resolvePackageName();
  const [currentVersion, latestVersion] = await Promise.all([
    autoUpdateDependencies.resolveCurrentVersion(),
    autoUpdateDependencies.fetchLatestVersion(packageName),
  ]);

  await autoUpdateDependencies.writeUpdateState(input.cwd, input.env, {
    last_checked_at: new Date(nowMs).toISOString(),
    last_seen_latest: latestVersion ?? state?.last_seen_latest,
  });

  if (!currentVersion || !latestVersion || !isNewerVersion(currentVersion, latestVersion)) {
    return;
  }

  const approved = await autoUpdateDependencies.askYesNo(
    `[omg] Update available: v${currentVersion} → v${latestVersion}. Update now? [Y/n] `,
  );

  if (!approved) {
    return;
  }

  input.io.stdout(`[omg] Running: npm install -g ${packageName}@latest`);

  try {
    await autoUpdateDependencies.runGlobalUpdate({
      cwd: input.cwd,
      env: input.env,
      packageName,
    });
  } catch (error) {
    input.io.stderr(`[omg] Auto-update failed: ${(error as Error).message}`);
    input.io.stderr(`[omg] Run manually: npm install -g ${packageName}@latest`);
    return;
  }

  try {
    await autoUpdateDependencies.refreshSetupAfterUpdate({
      cwd: input.cwd,
      io: input.io,
    });
  } catch (error) {
    input.io.stderr(`[omg] Updated package, but setup refresh failed: ${(error as Error).message}`);
  }

  input.io.stdout(`[omg] Updated to v${latestVersion}. Restart to use the new version.`);
}
