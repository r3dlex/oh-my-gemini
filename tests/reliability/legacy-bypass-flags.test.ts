import { describe, expect, test } from 'vitest';

import {
  CANONICAL_LEGACY_RUNNING_SUCCESS_ENV_FLAG,
  CANONICAL_LEGACY_VERIFY_GATE_PASS_ENV_FLAG,
  COMPAT_LEGACY_RUNNING_SUCCESS_ENV_FLAG,
  COMPAT_LEGACY_VERIFY_GATE_PASS_ENV_FLAG,
  getLegacyBypassUsages,
  isLegacyRunningSuccessEnabled,
  isLegacyVerifyGatePassEnabled,
  listLegacyBypassDeprecationWarnings,
} from '../../src/constants.js';

describe('reliability: legacy bypass flag naming', () => {
  test('accepts both OMG-first and OMG compatibility env flags', () => {
    expect(isLegacyRunningSuccessEnabled({
      [CANONICAL_LEGACY_RUNNING_SUCCESS_ENV_FLAG]: '1',
    })).toBe(true);

    expect(isLegacyRunningSuccessEnabled({
      [COMPAT_LEGACY_RUNNING_SUCCESS_ENV_FLAG]: '1',
    })).toBe(true);

    expect(isLegacyVerifyGatePassEnabled({
      [CANONICAL_LEGACY_VERIFY_GATE_PASS_ENV_FLAG]: '1',
    })).toBe(true);

    expect(isLegacyVerifyGatePassEnabled({
      [COMPAT_LEGACY_VERIFY_GATE_PASS_ENV_FLAG]: '1',
    })).toBe(true);
  });

  test('reports canonical OMG env names while preserving compatibility behavior', () => {
    const warnings = listLegacyBypassDeprecationWarnings({
      [COMPAT_LEGACY_RUNNING_SUCCESS_ENV_FLAG]: '1',
      [CANONICAL_LEGACY_VERIFY_GATE_PASS_ENV_FLAG]: '1',
    });

    expect(warnings[0]).toContain('OMG_LEGACY_RUNNING_SUCCESS=1');
    expect(warnings[0]).toContain('OMG_LEGACY_RUNNING_SUCCESS=1');
    expect(warnings[1]).toContain('OMG_LEGACY_VERIFY_GATE_PASS=1');
    expect(warnings[1]).toContain('OMG_LEGACY_VERIFY_GATE_PASS=1');

    const usages = getLegacyBypassUsages({
      [COMPAT_LEGACY_RUNNING_SUCCESS_ENV_FLAG]: '1',
      [CANONICAL_LEGACY_VERIFY_GATE_PASS_ENV_FLAG]: '1',
    });

    expect(usages.map((usage) => usage.flag)).toStrictEqual([
      CANONICAL_LEGACY_RUNNING_SUCCESS_ENV_FLAG,
      CANONICAL_LEGACY_VERIFY_GATE_PASS_ENV_FLAG,
    ]);
    expect(usages.every((usage) => usage.enabled)).toBe(true);
  });
});
