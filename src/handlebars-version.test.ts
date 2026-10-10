import fs from 'fs';
import path from 'path';

type SemanticVersion = {
  major: number;
  minor: number;
  patch: number;
};

const parseSemanticVersion = (version: string): SemanticVersion => {
  const match = version.match(/^(\d+)\.(\d+)\.(\d+)/);
  if (match === null) {
    throw new Error(`Unable to parse "${version}" as a semantic version`);
  }
  const [, majorText, minorText, patchText] = match;
  return {
    major: Number(majorText),
    minor: Number(minorText),
    patch: Number(patchText),
  };
};

const compareSemanticVersions = (
  left: SemanticVersion,
  right: SemanticVersion,
): number => {
  if (left.major !== right.major) {
    return left.major - right.major;
  }
  if (left.minor !== right.minor) {
    return left.minor - right.minor;
  }
  return left.patch - right.patch;
};

const isWithinVulnerableHandlebarsRange = (version: string): boolean => {
  const parsedVersion = parseSemanticVersion(version);
  const lowerInclusiveBound = parseSemanticVersion('4.0.0');
  const upperInclusiveBound = parseSemanticVersion('4.7.9');
  return (
    compareSemanticVersions(parsedVersion, lowerInclusiveBound) >= 0 &&
    compareSemanticVersions(parsedVersion, upperInclusiveBound) <= 0
  );
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

const readResolvedHandlebarsVersion = (packageLockPath: string): string => {
  const packageLockContent = fs.readFileSync(packageLockPath, 'utf-8');
  const parsedPackageLock: unknown = JSON.parse(packageLockContent);
  if (!isRecord(parsedPackageLock)) {
    throw new Error('package-lock.json did not parse to an object');
  }
  const packages = parsedPackageLock['packages'];
  if (!isRecord(packages)) {
    throw new Error('package-lock.json has no "packages" object');
  }
  const handlebarsEntry = packages['node_modules/handlebars'];
  if (!isRecord(handlebarsEntry)) {
    throw new Error(
      'package-lock.json has no "node_modules/handlebars" entry',
    );
  }
  const version = handlebarsEntry['version'];
  if (typeof version !== 'string') {
    throw new Error(
      'package-lock.json "node_modules/handlebars" entry has no string "version" field',
    );
  }
  return version;
};

describe('handlebars dependency version in package-lock.json', () => {
  test('resolved handlebars version is not within the vulnerable range >= 4.0.0, <= 4.7.9 (GHSA-8r5x-fm3f-whwj, GHSA-p8wg-vrv2-v86f)', () => {
    const packageLockPath = path.join(__dirname, '..', 'package-lock.json');

    const resolvedVersion = readResolvedHandlebarsVersion(packageLockPath);

    expect(isWithinVulnerableHandlebarsRange(resolvedVersion)).toBe(false);
  });
});
