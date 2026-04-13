import {
  createDefaultHookRegistry,
  mergeHookResults,
  runHookPipeline,
} from './index.js';
import type {
  HookContext,
  HookEventName,
  HookResult,
  RegisteredHook,
} from './types.js';

export type GeminiHookEventName =
  | 'SessionStart'
  | 'BeforeAgent'
  | 'BeforeTool'
  | 'AfterTool'
  | 'SessionEnd'
  | 'PreCompress'
  | 'Stop';

export interface GeminiHookBridgeInput {
  cwd: string;
  event: string;
  payload: unknown;
  hooks?: readonly RegisteredHook[];
  runHookPipelineFn?: (
    context: HookContext,
    hooks: readonly RegisteredHook[],
  ) => Promise<HookResult[]>;
}

interface GeminiHookBridgeOutput {
  continue?: boolean;
  decision?: 'allow' | 'deny';
  hookSpecificOutput?: Record<string, unknown>;
  reason?: string;
  stopReason?: string;
  systemMessage?: string;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function readString(
  source: Record<string, unknown>,
  key: string,
): string | undefined {
  const value = source[key];
  return typeof value === 'string' && value.trim().length > 0 ? value : undefined;
}

function mapGeminiEventToInternalEvent(
  event: string,
): HookEventName | undefined {
  switch (event) {
    case 'SessionStart':
      return 'SessionStart';
    case 'BeforeAgent':
      return 'UserPromptSubmit';
    case 'BeforeTool':
      return 'PreToolUse';
    case 'AfterTool':
      return 'PostToolUse';
    case 'SessionEnd':
      return 'SessionEnd';
    case 'PreCompress':
      return 'PreCompact';
    case 'Stop':
      return 'Stop';
    default:
      return undefined;
  }
}

function extractPermissionRequest(payload: Record<string, unknown>): string | undefined {
  if (payload.tool_name !== 'run_shell_command') {
    return undefined;
  }

  const toolInput = payload.tool_input;
  if (!isRecord(toolInput)) {
    return undefined;
  }

  const command = toolInput.command;
  return typeof command === 'string' && command.trim().length > 0
    ? command
    : undefined;
}

export function buildHookContextFromGeminiPayload(
  input: Pick<GeminiHookBridgeInput, 'cwd' | 'event' | 'payload'>,
): HookContext {
  const payload = isRecord(input.payload) ? input.payload : {};
  const prompt = readString(payload, 'prompt');

  return {
    cwd: readString(payload, 'cwd') ?? input.cwd,
    event: mapGeminiEventToInternalEvent(input.event),
    sessionId: readString(payload, 'session_id'),
    prompt,
    task: prompt,
    toolName: readString(payload, 'tool_name'),
    toolInput: payload.tool_input,
    toolOutput: payload.tool_response ?? payload.tool_output,
    permissionRequest: extractPermissionRequest(payload),
    metadata: payload,
  };
}

function joinNonEmpty(parts: Array<string | undefined>): string | undefined {
  const unique = [...new Set(parts.map((part) => part?.trim()).filter(Boolean))];
  return unique.length > 0 ? unique.join('\n\n') : undefined;
}

function buildGeminiHookOutput(
  event: string,
  result: HookResult,
): GeminiHookBridgeOutput {
  const warnings = result.warnings?.join('\n');
  const systemMessage = joinNonEmpty([result.systemMessage, warnings]);

  if (result.continue === false) {
    return {
      continue: false,
      stopReason:
        result.message ??
        warnings ??
        'oh-my-gemini hook bridge requested an immediate stop.',
      systemMessage,
    };
  }

  if (event === 'BeforeTool' && result.data?.approved === false) {
    return {
      decision: 'deny',
      reason:
        warnings ??
        result.message ??
        'oh-my-gemini permission policy requires manual review for this tool request.',
      systemMessage,
    };
  }

  const additionalContext = joinNonEmpty([
    result.systemMessage,
    event === 'SessionEnd' ? result.message : undefined,
  ]);

  if (event === 'SessionStart' || event === 'BeforeAgent' || event === 'AfterTool') {
    return {
      ...(additionalContext
        ? {
            hookSpecificOutput: {
              additionalContext,
            },
          }
        : {}),
      systemMessage,
    };
  }

  if (event === 'PreCompress' || event === 'SessionEnd') {
    return {
      systemMessage: additionalContext ?? systemMessage,
    };
  }

  return {
    ...(systemMessage ? { systemMessage } : {}),
  };
}

export async function executeGeminiHookBridge(
  input: GeminiHookBridgeInput,
): Promise<Record<string, unknown>> {
  const internalEvent = mapGeminiEventToInternalEvent(input.event);
  if (!internalEvent) {
    return {};
  }

  const hooks = input.hooks ?? createDefaultHookRegistry();
  const context = buildHookContextFromGeminiPayload(input);
  const results = await (input.runHookPipelineFn ?? runHookPipeline)(context, hooks);
  const merged = mergeHookResults(results);
  return buildGeminiHookOutput(input.event, merged) as Record<string, unknown>;
}
