import { readFileSync } from 'node:fs';

import { createDefaultHookRegistry, mergeHookResults, runHookPipeline } from './index.js';
import type { HookContext, HookEventName, HookResult, RegisteredHook } from './types.js';

export interface GeminiHookPayload {
  session_id?: string;
  transcript_path?: string;
  cwd?: string;
  hook_event_name?: string;
  timestamp?: string;
  prompt?: string;
  prompt_response?: string;
  stop_hook_active?: boolean;
  tool_name?: string;
  tool_input?: unknown;
  tool_response?: unknown;
  mcp_context?: Record<string, unknown>;
  original_request_name?: string;
  source?: string;
  reason?: string;
  trigger?: string;
  message?: string;
  details?: Record<string, unknown>;
  notification_type?: string;
}

export interface GeminiHookOutput {
  continue?: boolean;
  stopReason?: string;
  decision?: 'allow' | 'deny';
  reason?: string;
  suppressOutput?: boolean;
  systemMessage?: string;
  hookSpecificOutput?: Record<string, unknown>;
}

const ADDITIONAL_CONTEXT_EVENTS = new Set<HookEventName>([
  'SessionStart',
  'UserPromptSubmit',
  'PostToolUse',
  'PreCompact',
]);

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export function readGeminiHookPayloadFromStdin(): GeminiHookPayload {
  const raw = readFileSync(0, 'utf8').trim();
  if (!raw) {
    throw new Error('Gemini hook bridge expected a JSON payload on stdin.');
  }

  return JSON.parse(raw) as GeminiHookPayload;
}

export function mapGeminiHookEventToInternalEvent(eventName: string | undefined): HookEventName | null {
  switch (eventName) {
    case 'BeforeAgent':
      return 'UserPromptSubmit';
    case 'BeforeTool':
      return 'PreToolUse';
    case 'AfterTool':
      return 'PostToolUse';
    case 'SessionStart':
      return 'SessionStart';
    case 'SessionEnd':
      return 'SessionEnd';
    case 'PreCompress':
      return 'PreCompact';
    default:
      return null;
  }
}

function extractPermissionRequest(toolName: string | undefined, toolInput: unknown): string | undefined {
  if (toolName !== 'run_shell_command' && toolName !== 'shell' && toolName !== 'bash') {
    return undefined;
  }

  if (typeof toolInput === 'string') {
    return toolInput;
  }

  if (!isRecord(toolInput)) {
    return undefined;
  }

  const command =
    typeof toolInput.command === 'string'
      ? toolInput.command
      : typeof toolInput.cmd === 'string'
        ? toolInput.cmd
        : undefined;

  return command?.trim() || undefined;
}

export function buildInternalHookContext(cwd: string, payload: GeminiHookPayload): HookContext | null {
  const event = mapGeminiHookEventToInternalEvent(payload.hook_event_name);
  if (!event) {
    return null;
  }

  return {
    cwd,
    event,
    sessionId: payload.session_id,
    prompt: payload.prompt,
    task: payload.prompt,
    toolName: payload.tool_name,
    toolInput: payload.tool_input,
    toolOutput: payload.tool_response,
    permissionRequest: extractPermissionRequest(payload.tool_name, payload.tool_input),
    metadata: {
      transcriptPath: payload.transcript_path,
      timestamp: payload.timestamp,
      promptResponse: payload.prompt_response,
      stopHookActive: payload.stop_hook_active,
      mcpContext: payload.mcp_context,
      originalRequestName: payload.original_request_name,
      source: payload.source,
      sessionEndReason: payload.reason,
      preCompressTrigger: payload.trigger,
      notificationType: payload.notification_type,
      notificationMessage: payload.message,
      notificationDetails: payload.details,
    },
  };
}

function collectOutputMessages(result: HookResult): string[] {
  return [
    result.systemMessage,
    result.message,
    ...(result.warnings ?? []),
  ].filter((value): value is string => typeof value === 'string' && value.trim().length > 0);
}

function resolveDeniedReason(result: HookResult): string | undefined {
  if (result.data && typeof result.data === 'object' && result.data !== null) {
    const approved = (result.data as Record<string, unknown>).approved;
    if (approved === false) {
      return collectOutputMessages(result).join('\n') || 'Blocked by oh-my-gemini hook policy.';
    }
  }

  return undefined;
}

export function convertHookResultToGeminiOutput(event: HookEventName, result: HookResult): GeminiHookOutput {
  const messages = collectOutputMessages(result);
  const systemMessage = messages.join('\n').trim() || undefined;
  const deniedReason = resolveDeniedReason(result);
  const hookSpecificOutput: Record<string, unknown> = {};

  if (systemMessage && ADDITIONAL_CONTEXT_EVENTS.has(event)) {
    hookSpecificOutput.additionalContext = systemMessage;
  }

  const output: GeminiHookOutput = {
    suppressOutput: true,
  };

  if (systemMessage) {
    output.systemMessage = systemMessage;
  }

  if (deniedReason) {
    output.decision = 'deny';
    output.reason = deniedReason;
  }

  if (result.continue === false) {
    output.continue = false;
    output.stopReason = systemMessage ?? deniedReason ?? 'oh-my-gemini hook bridge stopped the session.';
  }

  if (Object.keys(hookSpecificOutput).length > 0) {
    output.hookSpecificOutput = hookSpecificOutput;
  }

  return output;
}

export async function executeGeminiHookBridge(params: {
  cwd: string;
  payload: GeminiHookPayload;
  hooks?: readonly RegisteredHook[];
}): Promise<GeminiHookOutput> {
  const context = buildInternalHookContext(params.cwd, params.payload);
  if (!context) {
    return {
      suppressOutput: true,
      systemMessage: `oh-my-gemini hook bridge ignored unsupported event ${params.payload.hook_event_name ?? 'unknown'}.`,
    };
  }

  const hooks = params.hooks ?? createDefaultHookRegistry();
  const results = await runHookPipeline(context, hooks);
  const merged = mergeHookResults(results);
  return convertHookResultToGeminiOutput(context.event ?? 'SessionStart', merged);
}
