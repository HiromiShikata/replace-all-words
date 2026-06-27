import { readFileSync } from 'fs';
import tseslint from 'typescript-eslint';
import importX from 'eslint-plugin-import-x';

const gitignoreLines = readFileSync('.gitignore', 'utf8')
  .split('\n')
  .map((line) => line.trim())
  .filter((line) => line && !line.startsWith('#'));

export default tseslint.config(
  { ignores: gitignoreLines },
  tseslint.configs.recommendedTypeChecked,
  {
    plugins: { 'import-x': importX },
    languageOptions: {
      parserOptions: {
        project: ['tsconfig.json'],
      },
    },
    rules: {
      '@typescript-eslint/require-await': 'off',
      '@typescript-eslint/no-non-null-assertion': 'error',
      '@typescript-eslint/consistent-type-assertions': [
        'error',
        { assertionStyle: 'never' },
      ],
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
        },
      ],
      'import-x/no-restricted-paths': [
        'error',
        {
          zones: [
            {
              target: './src/domain',
              from: './src/adapter',
            },
            {
              target: './src/domain/entities',
              from: './src/domain/usecases',
            },
            {
              target: './src/adapter/repositories',
              from: './src/adapter/entry-points',
            },
          ],
        },
      ],
    },
  },
);
