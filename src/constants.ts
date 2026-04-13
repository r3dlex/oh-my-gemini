export const DEFAULT_WORKERS = 3;
export const MIN_WORKERS = 1;
export const MAX_WORKERS = 8;

export const DEFAULT_FIX_LOOP_CAP = 3;

export const DEFAULT_MAX_WORKER_RESTARTS = 3;
export const MIN_MAX_WORKER_RESTARTS = 0;
export const MAX_MAX_WORKER_RESTARTS = 10;
export const CANONICAL_TERMINAL_PHASE = 'completed' as const;

export const CLI_USAGE_EXIT_CODE = 2;
export const INVALID_USAGE_EXIT_CODE = CLI_USAGE_EXIT_CODE;
export const INVALID_ARGUMENT_EXIT_CODE = CLI_USAGE_EXIT_CODE;
export const CLI_USAGE_ERROR_EXIT_CODE = CLI_USAGE_EXIT_CODE;

export const CANONICAL_LEGACY_RUNNING_SUCCESS_ENV_FLAG = 'OMG_LEGACY_RUNNING_SUCCESS';
export const CANONICAL_LEGACY_VERIFY_GATE_PASS_ENV_FLAG = 'OMG_LEGACY_VERIFY_GATE_PASS';
export const COMPAT_LEGACY_RUNNING_SUCCESS_ENV_FLAG = 'OMP_LEGACY_RUNNING_SUCCESS';
export const COMPAT_LEGACY_VERIFY_GATE_PASS_ENV_FLAG = 'OMP_LEGACY_VERIFY_GATE_PASS';

export const LEGACY_RUNNING_SUCCESS_ENV_FLAG = CANONICAL_LEGACY_RUNNING_SUCCESS_ENV_FLAG;
export const LEGACY_RUNNING_SUCCESS_ENV = LEGACY_RUNNING_SUCCESS_ENV_FLAG;
export const LEGACY_RUNNING_SUCCESS_ENV_ALIAS = COMPAT_LEGACY_RUNNING_SUCCESS_ENV_FLAG;
export const LEGACY_RUNNING_SUCCESS_ENV_FLAGS = [
  LEGACY_RUNNING_SUCCESS_ENV_FLAG,
  LEGACY_RUNNING_SUCCESS_ENV_ALIAS,
] as const;
export const LEGACY_VERIFY_GATE_PASS_ENV_FLAG = CANONICAL_LEGACY_VERIFY_GATE_PASS_ENV_FLAG;
export const LEGACY_VERIFY_GATE_PASS_ENV = LEGACY_VERIFY_GATE_PASS_ENV_FLAG;
export const LEGACY_VERIFY_GATE_PASS_ENV_ALIAS = COMPAT_LEGACY_VERIFY_GATE_PASS_ENV_FLAG;
export const LEGACY_VERIFY_GATE_PASS_ENV_FLAGS = [
  LEGACY_VERIFY_GATE_PASS_ENV_FLAG,
  LEGACY_VERIFY_GATE_PASS_ENV_ALIAS,
] as const;

export interface LegacyBypassDescriptor {
  envFlag: string;
  legacyAliases?: readonly string[];
  mode: 'running-success' | 'verify-gate-pass';
  description: string;
  warning: string;
}

const LEGACY_BYPASS_DESCRIPTORS = {
  runningSuccess: {
    envFlag: LEGACY_RUNNING_SUCCESS_ENV_FLAG,
    legacyAliases: [LEGACY_RUNNING_SUCCESS_ENV_ALIAS],
    mode: 'running-success',
    description: 'treat runtime status=running as a successful terminal completion',
    warning:
      'Deprecated compatibility bypass: OMG_LEGACY_RUNNING_SUCCESS=1 (legacy alias: OMP_LEGACY_RUNNING_SUCCESS=1) allows running snapshots to pass. Remove this temporary flag.',
  },
  verifyGatePass: {
    envFlag: LEGACY_VERIFY_GATE_PASS_ENV_FLAG,
    legacyAliases: [LEGACY_VERIFY_GATE_PASS_ENV_ALIAS],
    mode: 'verify-gate-pass',
    description: 'treat missing verifyBaselinePassed as a successful verify gate',
    warning:
      'Deprecated compatibility bypass: OMG_LEGACY_VERIFY_GATE_PASS=1 (legacy alias: OMP_LEGACY_VERIFY_GATE_PASS=1) allows missing verify baseline signals to pass. Remove this temporary flag.',
  },
} as const satisfies Record<string, LegacyBypassDescriptor>;

export interface LegacyBypassAuditRecord {
  envFlag: string;
  legacyAliases?: readonly string[];
  mode: LegacyBypassDescriptor['mode'];
  usedAt: string;
  context: string;
  description: string;
  warning: string;
}

function isAnyLegacyFlagEnabled(
  env: NodeJS.ProcessEnv,
  primaryFlag: string,
  compatibilityAliases: readonly string[] = [],
): boolean {
  return [primaryFlag, ...compatibilityAliases].some((flag) => env[flag] === '1');
}

function readEnabledFlag(
  env: NodeJS.ProcessEnv,
  flags: readonly string[],
): string | undefined {
  for (const flag of flags) {
    if (env[flag] === '1') {
      return flag;
    }
    if (env[flag] === '0') {
      return undefined;
    }
  }
  return undefined;
}

export function isLegacyRunningSuccessEnabled(
  env: NodeJS.ProcessEnv = process.env,
): boolean {
  if (Object.prototype.hasOwnProperty.call(env, CANONICAL_LEGACY_RUNNING_SUCCESS_ENV_FLAG)) {
    return env[CANONICAL_LEGACY_RUNNING_SUCCESS_ENV_FLAG] === '1';
  }
  return env[COMPAT_LEGACY_RUNNING_SUCCESS_ENV_FLAG] === '1';
}

export function isLegacyVerifyGatePassEnabled(
  env: NodeJS.ProcessEnv = process.env,
): boolean {
  if (Object.prototype.hasOwnProperty.call(env, CANONICAL_LEGACY_VERIFY_GATE_PASS_ENV_FLAG)) {
    return env[CANONICAL_LEGACY_VERIFY_GATE_PASS_ENV_FLAG] === '1';
  }
  return env[COMPAT_LEGACY_VERIFY_GATE_PASS_ENV_FLAG] === '1';
}

export function listLegacyBypassDeprecationWarnings(
  env: NodeJS.ProcessEnv = process.env,
): string[] {
  const warnings: string[] = [];

  if (isLegacyRunningSuccessEnabled(env)) {
    warnings.push(LEGACY_BYPASS_DESCRIPTORS.runningSuccess.warning);
  }
  if (isLegacyVerifyGatePassEnabled(env)) {
    warnings.push(LEGACY_BYPASS_DESCRIPTORS.verifyGatePass.warning);
  }

  return warnings;
}

export function buildLegacyRunningSuccessAuditRecord(
  context: string,
  usedAt = new Date().toISOString(),
): LegacyBypassAuditRecord {
  return {
    ...LEGACY_BYPASS_DESCRIPTORS.runningSuccess,
    context,
    usedAt,
  };
}

export function buildLegacyVerifyGatePassAuditRecord(
  context: string,
  usedAt = new Date().toISOString(),
): LegacyBypassAuditRecord {
  return {
    ...LEGACY_BYPASS_DESCRIPTORS.verifyGatePass,
    context,
    usedAt,
  };
}

export interface LegacyBypassUsage {
  flag: string;
  legacyAliases?: readonly string[];
  matchedFlag?: string;
  auditCode: LegacyBypassDescriptor['mode'];
  enabled: boolean;
  description: string;
  deprecationWarning: string;
}

export function getLegacyBypassUsages(
  env: NodeJS.ProcessEnv = process.env,
): LegacyBypassUsage[] {
  const runningSuccessFlag = readEnabledFlag(env, LEGACY_RUNNING_SUCCESS_ENV_FLAGS);
  const verifyGatePassFlag = readEnabledFlag(env, LEGACY_VERIFY_GATE_PASS_ENV_FLAGS);

  return [
    {
      flag: LEGACY_RUNNING_SUCCESS_ENV_FLAG,
      legacyAliases: LEGACY_BYPASS_DESCRIPTORS.runningSuccess.legacyAliases,
      auditCode: LEGACY_BYPASS_DESCRIPTORS.runningSuccess.mode,
      matchedFlag: runningSuccessFlag,
      enabled: runningSuccessFlag !== undefined,
      description: LEGACY_BYPASS_DESCRIPTORS.runningSuccess.description,
      deprecationWarning: LEGACY_BYPASS_DESCRIPTORS.runningSuccess.warning,
    },
    {
      flag: LEGACY_VERIFY_GATE_PASS_ENV_FLAG,
      legacyAliases: LEGACY_BYPASS_DESCRIPTORS.verifyGatePass.legacyAliases,
      auditCode: LEGACY_BYPASS_DESCRIPTORS.verifyGatePass.mode,
      matchedFlag: verifyGatePassFlag,
      enabled: verifyGatePassFlag !== undefined,
      description: LEGACY_BYPASS_DESCRIPTORS.verifyGatePass.description,
      deprecationWarning: LEGACY_BYPASS_DESCRIPTORS.verifyGatePass.warning,
    },
  ];
}

export function getEnabledLegacyBypassUsages(
  env: NodeJS.ProcessEnv = process.env,
): LegacyBypassUsage[] {
  return getLegacyBypassUsages(env).filter((usage) => usage.enabled);
}

export function emitLegacyBypassAuditLogs(params: {
  env?: NodeJS.ProcessEnv;
  log?: (message: string) => void;
  scope?: string;
} = {}): LegacyBypassUsage[] {
  const enabled = getEnabledLegacyBypassUsages(params.env ?? process.env);
  const log = params.log ?? ((message: string) => console.warn(message));
  const scope = params.scope ?? 'runtime';

  for (const usage of enabled) {
    log(
      `[legacy-bypass][audit] scope=${scope} flag=${usage.matchedFlag ?? usage.flag} canonical=${usage.flag} code=${usage.auditCode} detail=${usage.description}`,
    );
    log(`[legacy-bypass][deprecation] ${usage.deprecationWarning}`);
  }

  return enabled;
}

export const DEFAULT_VERIFY_SUITES = [
  'typecheck',
  'smoke',
  'integration',
  'reliability',
] as const;
