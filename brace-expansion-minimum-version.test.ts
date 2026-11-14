import fs from 'fs';
import path from 'path';

type PatchedVersionRequirement = {
  major: number;
  minimumVersion: string;
};

type InstalledBraceExpansion = {
  lockfileKey: string;
  version: string;
};

const BRACE_EXPANSION_PACKAGE_NAME = 'brace-expansion';

const patchedVersionRequirements: PatchedVersionRequirement[] = [
  { major: 1, minimumVersion: '1.1.20' },
  { major: 2, minimumVersion: '2.1.6' },
  { major: 5, minimumVersion: '5.0.11' },
];

const parseNumericVersionParts = (version: string): number[] =>
  version
    .split('-')[0]
    .split('.')
    .map((part) => Number(part));

const compareVersions = (left: string, right: string): number => {
  const leftParts = parseNumericVersionParts(left);
  const rightParts = parseNumericVersionParts(right);
  const partCount = Math.max(leftParts.length, rightParts.length);
  for (let index = 0; index < partCount; index += 1) {
    const difference = (leftParts[index] ?? 0) - (rightParts[index] ?? 0);
    if (difference !== 0) {
      return difference;
    }
  }
  return 0;
};

const majorVersionOf = (version: string): number =>
  parseNumericVersionParts(version)[0];

const readInstalledBraceExpansions = (): InstalledBraceExpansion[] => {
  const packageLockPath = path.join(__dirname, 'package-lock.json');
  const packageLock = JSON.parse(fs.readFileSync(packageLockPath, 'utf-8')) as {
    packages: Record<string, { version?: string }>;
  };
  const ownEntryKey = `node_modules/${BRACE_EXPANSION_PACKAGE_NAME}`;
  const nestedEntryKeySuffix = `/node_modules/${BRACE_EXPANSION_PACKAGE_NAME}`;
  return Object.entries(packageLock.packages)
    .filter(
      ([key]) => key === ownEntryKey || key.endsWith(nestedEntryKeySuffix),
    )
    .map(([key, entry]) => {
      if (typeof entry.version !== 'string') {
        throw new Error(
          `package-lock.json entry "${key}" has no string "version" field`,
        );
      }
      return { lockfileKey: key, version: entry.version };
    });
};

describe('brace-expansion versions recorded in package-lock.json', () => {
  it('every installed brace-expansion entry is at or above the patched version for its major', () => {
    const installed = readInstalledBraceExpansions();
    expect(installed.length).toBeGreaterThan(0);

    const violations = installed.flatMap(({ lockfileKey, version }) => {
      const major = majorVersionOf(version);
      const requirement = patchedVersionRequirements.find(
        (candidate) => candidate.major === major,
      );
      if (requirement === undefined) {
        return [
          `${lockfileKey} ${version}: no patched-version requirement for major ${major}`,
        ];
      }
      if (compareVersions(version, requirement.minimumVersion) < 0) {
        return [
          `${lockfileKey} ${version} is below the patched version ${requirement.minimumVersion}`,
        ];
      }
      return [];
    });

    expect(violations).toEqual([]);
  });
});
