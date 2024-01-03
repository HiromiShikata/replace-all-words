import { execSync } from 'child_process';

import fs from 'fs';
import path from 'path';

describe('npx script execution test', () => {
  describe('help', () => {
    it('should display the full help message without error', async () => {
      const output = execSync(
        'npx ts-node ./src/adapter/entry-points/cli/index.ts --help',
      ).toString();
      expect(output.trim()).toEqual(
        `Usage: Replace all words [options] <targetDirectoryPath> <beforeWord> <afterWord>

A CLI command to replace all occurrences of a word (oldWord) with another word
(newWord) in TypeScript files within the specified target directory. The
replacement is performed while preserving the original casing format of the
words. For example, if the oldWord is in camelCase, the replaced word will also
be in camelCase. Similarly, if the oldWord is in snake_case, the replaced word
will be in snake_case.

Arguments:
  targetDirectoryPath  Path to the target directory
  beforeWord           Word to be replaced
  afterWord            Word to replace with

Options:
  -h, --help           display help for command
`.trim(),
      );
    });
  });

  describe('execute', () => {
    const testDir = path.join(__dirname, 'tmp', 'test-dir');

    beforeEach(() => {
      fs.rmSync(testDir, { recursive: true, force: true });
      fs.mkdirSync(testDir, { recursive: true });
      fs.writeFileSync(
        path.join(testDir, 'testFile1.ts'),
        'const testWord = "hello";',
      );
      fs.mkdirSync(path.join(testDir, 'subdir'));
      fs.writeFileSync(
        path.join(testDir, 'subdir', 'testFile2.ts'),
        'const testWord = "hello";',
      );
    });
    afterEach(() => {
      fs.rmSync(testDir, { recursive: true, force: true });
    });

    it('should run the script without error', async () => {
      const output = execSync(
        `npx ts-node ./src/adapter/entry-points/cli/index.ts ${testDir} testWord newWord`,
      ).toString();
      expect(output.trim()).toContain('✨🚀 Done 🚀✨');
    });
  });
});
