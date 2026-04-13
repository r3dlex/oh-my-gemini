import { readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';

import { describe, expect, test } from 'vitest';

import { repoRoot } from '../utils/runtime.js';

const AGENT_CONTEXT_FILES = [
  'GEMINI.md',
  path.join('extensions', 'oh-my-gemini', 'GEMINI.md'),
] as const;

const SKILL_DIRS = [
  path.join(repoRoot, 'skills'),
  path.join(repoRoot, 'src', 'skills'),
] as const;

function countLines(content: string): number {
  return content.split(/\r?\n/).length;
}

function listSkillFiles(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => path.join(dir, entry.name, 'SKILL.md'))
    .sort();
}

function readDescription(content: string): string | null {
  const match = content.match(/^description:\s*(.+)$/m);
  return match?.[1]?.trim() ?? null;
}

describe('reliability: agent docs hygiene', () => {
  test('agent context files stay within the progressive-disclosure core size target', () => {
    for (const relativePath of AGENT_CONTEXT_FILES) {
      const filePath = path.join(repoRoot, relativePath);
      const content = readFileSync(filePath, 'utf8');
      expect(countLines(content), `${relativePath} exceeds 100 lines`).toBeLessThanOrEqual(100);
    }
  });

  test('repo skill descriptions include concrete trigger wording', () => {
    for (const dir of SKILL_DIRS) {
      for (const filePath of listSkillFiles(dir)) {
        const relativePath = path.relative(repoRoot, filePath);
        const content = readFileSync(filePath, 'utf8');
        const description = readDescription(content);

        expect(description, `${relativePath} is missing description frontmatter`).toBeTruthy();
        expect(description!.length, `${relativePath} description exceeds 1024 chars`).toBeLessThanOrEqual(1024);
        expect(
          description,
          `${relativePath} description must end with concrete trigger wording`,
        ).toMatch(/Use when .+\.$/);
      }
    }
  });

  test('repo skill files stay within the progressive-disclosure core size target', () => {
    for (const dir of SKILL_DIRS) {
      for (const filePath of listSkillFiles(dir)) {
        const relativePath = path.relative(repoRoot, filePath);
        const content = readFileSync(filePath, 'utf8');
        expect(countLines(content), `${relativePath} exceeds 100 lines`).toBeLessThanOrEqual(100);
      }
    }
  });
});
