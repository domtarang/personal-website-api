import fs from 'node:fs';
import path from 'node:path';

const PROJECT_ROOT_MARKER = 'package.json';
let cachedProjectRoot: string | null = null;

const findProjectRoot = (startDirectory: string): string | null => {
  let currentDirectory = path.resolve(startDirectory);
  const { root } = path.parse(currentDirectory);

  while (true) {
    if (fs.existsSync(path.join(currentDirectory, PROJECT_ROOT_MARKER))) {
      return currentDirectory;
    }

    if (currentDirectory === root) {
      return null;
    }

    currentDirectory = path.dirname(currentDirectory);
  }
};

export const getProjectRoot = (): string => {
  if (cachedProjectRoot) {
    return cachedProjectRoot;
  }

  const candidates = [process.cwd(), __dirname];

  for (const candidate of candidates) {
    const root = findProjectRoot(candidate);

    if (root) {
      cachedProjectRoot = root;
      return root;
    }
  }

  throw new Error('Unable to determine the project root. Start the process from within the project directory.');
};

export const resolveProjectPath = (...segments: string[]): string => {
  return path.resolve(getProjectRoot(), ...segments);
};
