import fs from 'node:fs';
import path from 'node:path';

import {
  buildInternalHookContext,
  executeGeminiHookBridge,
  mapGeminiHookEventToInternalEvent,
  readGeminiHookPayloadFromStdin,
  type GeminiHookOutput,
  type GeminiHookPayload,
} from '../../hooks/bridge.js';
import {
  createDefaultHookRegistry,
  mergeHookResults,
  runHookPipeline,
  type HookContext,
  type HookEventName,
  type RegisteredHook,
} from '../../hooks/index.js';
import type { CliIo, CommandExecutionResult } from '../types.js';
import {
  findUnknownOptions,
  getStringOption,
  hasFlag,
  parseCliArgs,
} from './arg-utils.js';

export interface HooksCommandContext {
  cwd: string;
  io: CliIo;
  readStdin?: () => Promise<string>;
}

const CANONICAL_HOOKS_STATE_FILE = path.join('.omg', 'state', 'hooks.json');
const LEGACY_HOOKS_STATE_FILE = path.join('.omg', 'state', 'hooks.json');

const REGISTERED_HOOKS = [
  'createModeRegistryHook',
  'createProjectMemoryHook',
  'createLearnerHook',
  'createPermissionHandlerHook',
  'createRecoveryHook',
  'createSubagentTrackerHook',
  'createAutopilotHook',
  'createRalphHook',
  'createUltraworkHook',
  'createPreCompactHook',
  'createSessionEndHook',
  'createKeywordDetectorHook',
];

function printHooksHelp(io: CliIo): void {
  io.stdout(
    [
      'Usage: omg hooks <subcommand> [options]',
      'Compatibility alias: omg hooks <subcommand> [options]',
      '',
      'Subcommands:',
      '  init      Bootstrap hook scaffolding',
      '  exec      Execute the Gemini hook bridge (stdin JSON → stdout JSON)',
      '  status    Show hook pipeline state',
      '  validate  Validate trigger graph',
      '  test      Dry-run hook pipeline',
      '  dispatch  Run the internal TS hook registry for a Gemini hook event',
      '',
      'Options:',
      '  --event <name>  Override the Gemini hook event name when dispatching',
      '  --help          Show command help',
    ].join('\n'),
  );
}

function hooksStateFilePath(cwd: string): string {
  return path.join(cwd, CANONICAL_HOOKS_STATE_FILE);
}

function resolveHooksStateFilePath(cwd: string): string {
  const canonicalPath = path.join(cwd, CANONICAL_HOOKS_STATE_FILE);
  if (fs.existsSync(canonicalPath)) {
    return canonicalPath;
  }
  const legacyPath = path.join(cwd, LEGACY_HOOKS_STATE_FILE);
  if (fs.existsSync(legacyPath)) {
    return legacyPath;
  }
  return canonicalPath;
}

export function mapGeminiHookEventName(raw: string | undefined): HookEventName | null {
  return raw ? mapGeminiHookEventToInternalEvent(raw) : null;
}

export function buildHookContextFromGeminiInput(input: {
  cwd: string;
  eventName: string | undefined;
  payload: unknown;
}): HookContext {
  const payload = (typeof input.payload === 'object' && input.payload !== null
    ? input.payload
    : {}) as GeminiHookPayload & { workspace_path?: string; workspacePath?: string };
  const cwd = payload.workspace_path ?? payload.workspacePath ?? payload.cwd ?? input.cwd;
  const context = buildInternalHookContext(input.cwd, {
    ...payload,
    hook_event_name: input.eventName,
  });
  return context
    ? {
        ...context,
        cwd,
      }
    : {
        cwd,
        event: undefined,
        metadata: payload as Record<string, unknown>,
      };
}

export async function dispatchGeminiHook(input: {
  cwd: string;
  eventName: string | undefined;
  payload: unknown;
  registry?: readonly RegisteredHook[];
}): Promise<GeminiHookOutput> {
  if (!mapGeminiHookEventName(input.eventName)) {
    return {};
  }
  const payload = (typeof input.payload === 'object' && input.payload !== null
    ? input.payload
    : {}) as GeminiHookPayload;
  return executeGeminiHookBridge({
    cwd: input.cwd,
    payload: {
      ...payload,
      hook_event_name: input.eventName,
    },
    hooks: input.registry,
  });
}

function runInit(cwd: string, io: CliIo): CommandExecutionResult {
  const stateFilePath = hooksStateFilePath(cwd);
  const stateDir = path.dirname(stateFilePath);
  if (fs.existsSync(stateFilePath)) {
    io.stdout(`Hook state file already exists: ${stateFilePath}`);
    return { exitCode: 0 };
  }
  try {
    fs.mkdirSync(stateDir, { recursive: true });
    fs.writeFileSync(
      stateFilePath,
      JSON.stringify({ initialized: new Date().toISOString(), hooks: [] }, null, 2) + '\n',
      'utf8',
    );
    io.stdout(`Hook scaffolding initialized: ${stateFilePath}`);
    return { exitCode: 0 };
  } catch (error) {
    io.stderr(`Failed to initialize hook state: ${(error as Error).message}`);
    return { exitCode: 1 };
  }
}

function runStatus(cwd: string, io: CliIo): CommandExecutionResult {
  io.stdout('Registered hooks:');
  for (const hook of REGISTERED_HOOKS) {
    io.stdout(`  - ${hook}`);
  }
  const stateFilePath = resolveHooksStateFilePath(cwd);
  if (fs.existsSync(stateFilePath)) {
    io.stdout('');
    io.stdout(`Hook state file: ${stateFilePath}`);
    try {
      io.stdout(JSON.stringify(JSON.parse(fs.readFileSync(stateFilePath, 'utf8')), null, 2));
    } catch (error) {
      io.stderr(`Failed to read hook state: ${(error as Error).message}`);
    }
  } else {
    io.stdout('');
    io.stdout(`No hook state file found at: ${stateFilePath}`);
    io.stdout('Run "omg hooks init" to bootstrap hook scaffolding.');
  }
  return { exitCode: 0 };
}

function runValidate(cwd: string, io: CliIo): CommandExecutionResult {
  const stateFilePath = resolveHooksStateFilePath(cwd);
  if (!fs.existsSync(stateFilePath)) {
    io.stdout('No hook state file found. Hook registry validation: OK (using defaults)');
    return { exitCode: 0 };
  }
  try {
    JSON.parse(fs.readFileSync(stateFilePath, 'utf8'));
    io.stdout(`Hook registry validation: OK (${stateFilePath})`);
    return { exitCode: 0 };
  } catch (error) {
    io.stderr(`Hook registry validation failed: ${(error as Error).message}`);
    return { exitCode: 1 };
  }
}

function runTest(io: CliIo): CommandExecutionResult {
  io.stdout('Dry-run mode - no hooks executed (placeholder)');
  return { exitCode: 0 };
}

async function readStdinFromContext(
  readStdin: HooksCommandContext['readStdin'],
): Promise<GeminiHookPayload> {
  if (readStdin) {
    const raw = await readStdin();
    if (!raw.trim()) {
      throw new Error('Gemini hook bridge expected a JSON payload on stdin.');
    }
    return JSON.parse(raw) as GeminiHookPayload;
  }
  return readGeminiHookPayloadFromStdin();
}

async function runExec(
  cwd: string,
  io: CliIo,
  readStdin: HooksCommandContext['readStdin'],
): Promise<CommandExecutionResult> {
  try {
    const payload = await readStdinFromContext(readStdin);
    const output = await executeGeminiHookBridge({ cwd, payload });
    io.stdout(JSON.stringify(output));
    return { exitCode: output.decision === 'deny' ? 2 : 0 };
  } catch (error) {
    io.stderr(`Failed to execute Gemini hook bridge: ${(error as Error).message}`);
    return { exitCode: 1 };
  }
}

async function runDispatch(rest: string[], context: HooksCommandContext): Promise<CommandExecutionResult> {
  const parsed = parseCliArgs(rest);
  const unknown = findUnknownOptions(parsed.options, ['event', 'help', 'h']);
  if (unknown.length > 0) {
    context.io.stderr(`Unknown option(s): ${unknown.map((key) => `--${key}`).join(', ')}`);
    return { exitCode: 2 };
  }
  const eventName = getStringOption(parsed.options, ['event'])
    ?? (parsed.positionals[0] ? String(parsed.positionals[0]) : undefined)
    ?? 'BeforeAgent';
  try {
    const payload = await readStdinFromContext(context.readStdin);
    const output = await dispatchGeminiHook({
      cwd: context.cwd,
      eventName,
      payload,
      registry: createDefaultHookRegistry(),
    });
    context.io.stdout(JSON.stringify(output));
    return { exitCode: output.decision === 'deny' ? 2 : 0 };
  } catch (error) {
    context.io.stderr(`Failed to dispatch Gemini hook event: ${(error as Error).message}`);
    return { exitCode: 1 };
  }
}

export async function executeHooksCommand(
  argv: string[],
  context: HooksCommandContext,
): Promise<CommandExecutionResult> {
  const { io, cwd } = context;
  if (argv.includes('--help') || argv.includes('-h')) {
    printHooksHelp(io);
    return { exitCode: 0 };
  }
  const [subcommand, ...rest] = argv;
  if (!subcommand) {
    printHooksHelp(io);
    return { exitCode: 0 };
  }
  switch (subcommand) {
    case 'init':
      return runInit(cwd, io);
    case 'exec':
      return runExec(cwd, io, context.readStdin);
    case 'bridge':
    case 'dispatch':
      return runDispatch(rest, context);
    case 'status':
      return runStatus(cwd, io);
    case 'validate':
      return runValidate(cwd, io);
    case 'test':
      return runTest(io);
    default:
      io.stderr(`Unknown subcommand: ${subcommand}`);
      io.stderr('Run "omg hooks --help" for usage.');
      return { exitCode: 2 };
  }
}
