import { createRequire } from 'node:module';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';

import type { CliIo, CommandExecutionResult } from '../types.js';
import { findUnknownOptions, hasFlag, parseCliArgs } from './arg-utils.js';

const execFileAsync = promisify(execFile);

export interface UpdateRunnerOutput {
  exitCode: number;
  message: string;
  details?: Record<string, unknown>;
}

export interface UpdateCommandContext {
  cwd: string;
  io: CliIo;
  updateRunner?: () => Promise<UpdateRunnerOutput>;
}

interface PackageMetadata {
  name?: string;
}

interface GlobalUpdateOptions {
  cwd?: string;
  env?: NodeJS.ProcessEnv;
  packageName?: string;
  execFileAsyncImpl?: (
    file: string,
    args: readonly string[],
    options: {
      cwd: string;
      env: NodeJS.ProcessEnv;
      encoding: BufferEncoding;
    },
  ) => Promise<{ stdout: string | Buffer; stderr: string | Buffer }>;
}

function printUpdateHelp(io: CliIo): void {
  io.stdout([
    'Usage: omg update [--json]',
    '',
    'Updates the globally installed oh-my-gemini package using npm.',
    '',
    'Options:',
    '  --json   Print machine-readable output',
    '  --help   Show command help',
  ].join('\n'));
}

export function resolveUpdatePackageName(
  packageMetadata: PackageMetadata = createRequire(import.meta.url)('../../../package.json') as PackageMetadata,
): string {
  return packageMetadata.name ?? 'oh-my-gemini';
}

export async function runNpmGlobalUpdate(options: GlobalUpdateOptions = {}): Promise<UpdateRunnerOutput> {
  const packageName = options.packageName ?? resolveUpdatePackageName();
  const cwd = options.cwd ?? process.cwd();
  const env = options.env ?? process.env;
  const execFileAsyncImpl = options.execFileAsyncImpl ?? execFileAsync;

  const result = await execFileAsyncImpl(
    'npm',
    ['install', '-g', `${packageName}@latest`],
    {
      cwd,
      env,
      encoding: 'utf8',
    },
  );

  return {
    exitCode: 0,
    message: `Updated ${packageName} to latest via npm install -g.`,
    details: {
      packageName,
      stdout: result.stdout.toString().trim() || undefined,
      stderr: result.stderr.toString().trim() || undefined,
    },
  };
}

async function defaultUpdateRunner(): Promise<UpdateRunnerOutput> {
  const require = createRequire(import.meta.url);
  const pkg = require('../../../package.json') as PackageMetadata;
  return runNpmGlobalUpdate({
    cwd: process.cwd(),
    env: process.env,
    packageName: resolveUpdatePackageName(pkg),
  });
}

export async function executeUpdateCommand(
  argv: string[],
  context: UpdateCommandContext,
): Promise<CommandExecutionResult> {
  const parsed = parseCliArgs(argv);
  const { io } = context;

  if (hasFlag(parsed.options, ['help', 'h'])) {
    printUpdateHelp(io);
    return { exitCode: 0 };
  }

  const unknownOptions = findUnknownOptions(parsed.options, ['json', 'help', 'h']);
  if (unknownOptions.length > 0) {
    io.stderr(`Unknown option(s): ${unknownOptions.map((key) => `--${key}`).join(', ')}`);
    return { exitCode: 2 };
  }

  if (parsed.positionals.length > 0) {
    io.stderr(`Unexpected positional arguments: ${parsed.positionals.join(' ')}.`);
    return { exitCode: 2 };
  }

  try {
    const output = await (context.updateRunner ?? defaultUpdateRunner)();
    if (hasFlag(parsed.options, ['json'])) {
      io.stdout(JSON.stringify(output, null, 2));
    } else {
      io.stdout(output.message);
      if (output.details) {
        io.stdout(JSON.stringify(output.details, null, 2));
      }
    }
    return { exitCode: output.exitCode };
  } catch (error) {
    io.stderr(`Update failed: ${(error as Error).message}`);
    return { exitCode: 1 };
  }
}
