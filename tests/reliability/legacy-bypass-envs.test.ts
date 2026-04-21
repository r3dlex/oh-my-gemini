import { describe, expect, test } from 'vitest';

import {
  LEGACY_RUNNING_SUCCESS_ENV_ALIAS,
  LEGACY_RUNNING_SUCCESS_ENV_FLAG,
  LEGACY_VERIFY_GATE_PASS_ENV_ALIAS,
  LEGACY_VERIFY_GATE_PASS_ENV_FLAG,
  isLegacyRunningSuccessEnabled,
  isLegacyVerifyGatePassEnabled,
  listLegacyBypassDeprecationWarnings,
} from '../../src/constants.js';

describe('reliability: legacy bypass env aliases', () => {
  test('prefers canonical OMG legacy bypass flags', () => {
    expect(
      isLegacyRunningSuccessEnabled({
        [LEGACY_RUNNING_SUCCESS_ENV_FLAG]: '1',
      }),
    ).toBe(true);

    expect(
      isLegacyVerifyGatePassEnabled({
        [LEGACY_VERIFY_GATE_PASS_ENV_FLAG]: '1',
      }),
    ).toBe(true);
  });

  test('falls back to legacy OMG aliases when canonical flags are absent', () => {
    expect(
      isLegacyRunningSuccessEnabled({
        [LEGACY_RUNNING_SUCCESS_ENV_ALIAS]: '1',
      }),
    ).toBe(true);

    expect(
      isLegacyVerifyGatePassEnabled({
        [LEGACY_VERIFY_GATE_PASS_ENV_ALIAS]: '1',
      }),
    ).toBe(true);
  });

  test('canonical false disables legacy alias fallback when both are present', () => {
    expect(
      isLegacyRunningSuccessEnabled({
        [LEGACY_RUNNING_SUCCESS_ENV_FLAG]: '0',
        [LEGACY_RUNNING_SUCCESS_ENV_ALIAS]: '1',
      }),
    ).toBe(false);
  });

  test('deprecation warnings mention canonical and legacy flag names', () => {
    const warnings = listLegacyBypassDeprecationWarnings({
      [LEGACY_RUNNING_SUCCESS_ENV_ALIAS]: '1',
      [LEGACY_VERIFY_GATE_PASS_ENV_FLAG]: '1',
    });

    expect(warnings.join('\n')).toContain('OMG_LEGACY_RUNNING_SUCCESS=1');
    expect(warnings.join('\n')).toContain('OMG_LEGACY_RUNNING_SUCCESS=1');
    expect(warnings.join('\n')).toContain('OMG_LEGACY_VERIFY_GATE_PASS=1');
    expect(warnings.join('\n')).toContain('OMG_LEGACY_VERIFY_GATE_PASS=1');
  });
});
