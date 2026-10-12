import fs from 'fs';
import path from 'path';

type NumericVersionParts = number[];

const toNumericVersionParts = (version: string): NumericVersionParts =>
  version
    .split('-')[0]
    .split('.')
    .map((part) => Number(part));

const isVersionAtLeast = (
  actualVersion: string,
  minimumVersion: string,
): boolean => {
  const actualParts = toNumericVersionParts(actualVersion);
  const minimumParts = toNumericVersionParts(minimumVersion);
  const partCount = Math.max(actualParts.length, minimumParts.length);
  for (let index = 0; index < partCount; index += 1) {
    const actualPart = actualParts[index] ?? 0;
    const minimumPart = minimumParts[index] ?? 0;
    if (actualPart !== minimumPart) {
      return actualPart > minimumPart;
    }
  }
  return true;
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

const readPackageLockPackages = (
  packageLockPath: string,
): Record<string, unknown> => {
  const packageLockContent = fs.readFileSync(packageLockPath, 'utf-8');
  const parsedPackageLock: unknown = JSON.parse(packageLockContent);
  if (!isRecord(parsedPackageLock)) {
    throw new Error('package-lock.json did not parse to an object');
  }
  const packages = parsedPackageLock['packages'];
  if (!isRecord(packages)) {
    throw new Error('package-lock.json has no "packages" object');
  }
  return packages;
};

const findInstalledVersionsOfPackage = (
  packages: Record<string, unknown>,
  packageName: string,
): string[] => {
  const ownEntryKey = `node_modules/${packageName}`;
  const nestedEntryKeySuffix = `/node_modules/${packageName}`;
  return Object.entries(packages)
    .filter(
      ([key]) => key === ownEntryKey || key.endsWith(nestedEntryKeySuffix),
    )
    .map(([key, entry]) => {
      if (!isRecord(entry)) {
        throw new Error(`package-lock.json entry "${key}" is not an object`);
      }
      const version = entry['version'];
      if (typeof version !== 'string') {
        throw new Error(
          `package-lock.json entry "${key}" has no string "version" field`,
        );
      }
      return version;
    });
};

type DependencyVersionPin = {
  packageName: string;
  minimumVersion: string;
};

const dependencyVersionPins: DependencyVersionPin[] = [
  {
    packageName: '@typescript-eslint/eslint-plugin',
    minimumVersion: '8.71.0',
  },
  { packageName: '@typescript-eslint/parser', minimumVersion: '8.71.0' },
  { packageName: 'dotenv', minimumVersion: '18.0.5' },
  { packageName: 'eslint', minimumVersion: '10.12.0' },
  { packageName: 'prettier', minimumVersion: '3.9.9' },
  { packageName: 'ts-jest', minimumVersion: '29.4.14' },
  { packageName: 'typescript-eslint', minimumVersion: '8.71.0' },
];

describe('dependency versions pinned in package-lock.json', () => {
  test.each(dependencyVersionPins)(
    'every installed "$packageName" entry resolves to at least version $minimumVersion',
    ({ packageName, minimumVersion }) => {
      const packageLockPath = path.join(__dirname, 'package-lock.json');
      const packages = readPackageLockPackages(packageLockPath);

      const installedVersions = findInstalledVersionsOfPackage(
        packages,
        packageName,
      );

      expect(installedVersions.length).toBeGreaterThan(0);
      installedVersions.forEach((installedVersion) => {
        expect(isVersionAtLeast(installedVersion, minimumVersion)).toBe(true);
      });
    },
  );
});
