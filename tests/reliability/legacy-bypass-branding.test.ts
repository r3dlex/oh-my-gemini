import { describe, expect, test } from 'vitest';

import {
  getLegacyBypassUsages,
  isLegacyRunningSuccessEnabled,
  isLegacyVerifyGatePassEnabled,
  listLegacyBypassDeprecationWarnings,
} from '../../src/constants.js';

describe('reliability: legacy bypass branding', () => {
  test('canonical OMG compatibility flags are enabled directly', () => {
    const env = {
      OMG_LEGACY_RUNNING_SUCCESS: '1',
      OMG_LEGACY_VERIFY_GATE_PASS: '1',
    } as NodeJS.ProcessEnv;

    expect(isLegacyRunningSuccessEnabled(env)).toBe(true);
    expect(isLegacyVerifyGatePassEnabled(env)).toBe(true);
  });

  test('legacy OMP compatibility aliases still enable bypasses and warnings mention both names', () => {
    const env = {
      OMP_LEGACY_RUNNING_SUCCESS: '1',
      OMP_LEGACY_VERIFY_GATE_PASS: '1',
    } as NodeJS.ProcessEnv;

    expect(isLegacyRunningSuccessEnabled(env)).toBe(true);
    expect(isLegacyVerifyGatePassEnabled(env)).toBe(true);

    const warnings = listLegacyBypassDeprecationWarnings(env).join('\n');
    expect(warnings).toContain('OMG_LEGACY_RUNNING_SUCCESS=1');
    expect(warnings).toContain('OMP_LEGACY_RUNNING_SUCCESS=1');
    expect(warnings).toContain('OMG_LEGACY_VERIFY_GATE_PASS=1');
    expect(warnings).toContain('OMP_LEGACY_VERIFY_GATE_PASS=1');

    const usages = getLegacyBypassUsages(env);
    expect(usages[0]?.flag).toBe('OMG_LEGACY_RUNNING_SUCCESS');
    expect(usages[0]?.legacyAliases).toContain('OMP_LEGACY_RUNNING_SUCCESS');
    expect(usages[1]?.flag).toBe('OMG_LEGACY_VERIFY_GATE_PASS');
    expect(usages[1]?.legacyAliases).toContain('OMP_LEGACY_VERIFY_GATE_PASS');
  });
});
