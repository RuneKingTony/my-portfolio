import tseslint from 'typescript-eslint';
import unusedImports from 'eslint-plugin-unused-imports';
import checkFile from 'eslint-plugin-check-file';
import eslintConfigPrettier from 'eslint-config-prettier';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import sonarjs from 'eslint-plugin-sonarjs';
import unicorn from 'eslint-plugin-unicorn';
import importX from 'eslint-plugin-import-x';
import regexp from 'eslint-plugin-regexp';
import vitest from '@vitest/eslint-plugin';
import { createTypeScriptImportResolver } from 'eslint-import-resolver-typescript';

const tsFiles = ['**/*.ts', '**/*.tsx', '**/*.mts'];
const reactFiles = ['**/*.tsx'];

const onlyFor = (files, configs) =>
  configs.map((config) => ({ ...config, files }));

const promote = (level) => (level === 'warn' || level === 1 ? 'error' : level);

// Presets ship some rules as `warn`, and a warning would be invisible:
// every rule in this repo is an error.
const asErrors = (config) => ({
  ...config,
  rules: Object.fromEntries(
    Object.entries(config.rules ?? {}).map(([name, setting]) => [
      name,
      Array.isArray(setting)
        ? [promote(setting[0]), ...setting.slice(1)]
        : promote(setting),
    ])
  ),
});

const noEnum = {
  selector: 'TSEnumDeclaration',
  message: 'Use a const object with `as const`, or a string-literal union.',
};

const colourMessage =
  'Use a CSS custom property; colour literals live in src/app/globals.css only.';

const noColourLiterals = [
  String.raw`#[0-9a-fA-F]{3}(?:[0-9a-fA-F]{3}(?:[0-9a-fA-F]{2})?)?\b`,
  String.raw`\b(?:rgba?|hsla?|oklch)\(`,
].flatMap((pattern) => [
  { selector: `Literal[value=/${pattern}/]`, message: colourMessage },
  {
    selector: `TemplateElement[value.raw=/${pattern}/]`,
    message: colourMessage,
  },
]);

const noDefaultExport = {
  selector: 'ExportDefaultDeclaration',
  message: 'Use a named export so imports stay greppable and renames safe.',
};

export default [
  {
    ignores: [
      '.next/**',
      'out/**',
      'coverage/**',
      'playwright-report/**',
      'test-results/**',
      'next-env.d.ts',
    ],
  },
  ...onlyFor(tsFiles, [
    ...tseslint.configs.strictTypeChecked,
    ...tseslint.configs.stylisticTypeChecked,
  ]),
  {
    files: tsFiles,
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  ...onlyFor(tsFiles, [
    asErrors(sonarjs.configs.recommended),
    asErrors(unicorn.configs.recommended),
    asErrors(regexp.configs['flat/recommended']),
  ]),
  {
    files: tsFiles,
    plugins: { 'import-x': importX },
    settings: {
      'import-x/extensions':
        importX.flatConfigs.typescript.settings['import-x/extensions'],
      'import-x/parsers':
        importX.flatConfigs.typescript.settings['import-x/parsers'],
      'import-x/resolver-next': [
        createTypeScriptImportResolver({
          project: `${import.meta.dirname}/tsconfig.json`,
        }),
      ],
    },
    rules: {
      'import-x/no-cycle': 'error',
      'import-x/no-duplicates': ['error', { 'prefer-inline': true }],
      'import-x/no-self-import': 'error',
    },
  },
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.mts', '**/*.js', '**/*.mjs'],
    plugins: { 'unused-imports': unusedImports },
    rules: { 'unused-imports/no-unused-imports': 'error' },
  },
  {
    files: tsFiles,
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/consistent-type-imports': [
        'error',
        { fixStyle: 'inline-type-imports', disallowTypeAnnotations: false },
      ],
    },
  },
  {
    files: tsFiles,
    rules: {
      eqeqeq: ['error', 'always'],
      'no-console': ['error', { allow: ['warn', 'error'] }],
      'no-nested-ternary': 'error',
      'no-else-return': 'error',
      'no-lonely-if': 'error',
      'no-unneeded-ternary': 'error',
      'no-implicit-coercion': 'error',
      'no-param-reassign': 'error',
      'prefer-template': 'error',
      'object-shorthand': 'error',
      complexity: ['error', 10],
      'max-depth': ['error', 3],
      'max-nested-callbacks': ['error', 3],
      'max-lines-per-function': [
        'error',
        { max: 60, skipBlankLines: true, skipComments: true },
      ],
      'sonarjs/cognitive-complexity': ['error', 15],
      '@typescript-eslint/max-params': ['error', { max: 3 }],
      '@typescript-eslint/no-shadow': 'error',
      '@typescript-eslint/no-use-before-define': [
        'error',
        { functions: false },
      ],
      '@typescript-eslint/strict-boolean-expressions': 'error',
      'unicorn/filename-case': 'off',
      'unicorn/import-style': [
        'error',
        { styles: { 'node:path': { default: true, named: true } } },
      ],
      'unicorn/no-useless-undefined': [
        'error',
        { checkArguments: false, checkArrowFunctionBody: false },
      ],
      'unicorn/no-nested-ternary': 'off',
      'unicorn/no-null': 'off',
      'unicorn/prevent-abbreviations': 'off',
      'sonarjs/no-unused-vars': 'off',
      'sonarjs/prefer-read-only-props': 'off',
      'no-restricted-syntax': ['error', noEnum, ...noColourLiterals],
      '@typescript-eslint/consistent-type-definitions': ['error', 'interface'],
      '@typescript-eslint/consistent-type-exports': 'error',
      '@typescript-eslint/dot-notation': [
        'error',
        { allowIndexSignaturePropertyAccess: true },
      ],
      '@typescript-eslint/no-confusing-void-expression': [
        'error',
        { ignoreArrowShorthand: true },
      ],
      '@typescript-eslint/no-import-type-side-effects': 'error',
      '@typescript-eslint/prefer-readonly': 'error',
      '@typescript-eslint/restrict-template-expressions': [
        'error',
        { allowNumber: true },
      ],
      '@typescript-eslint/switch-exhaustiveness-check': 'error',
      '@typescript-eslint/naming-convention': [
        'error',
        {
          selector: 'typeLike',
          format: ['PascalCase'],
        },
        {
          selector: 'variable',
          format: ['camelCase', 'PascalCase', 'UPPER_CASE'],
          leadingUnderscore: 'allow',
        },
        {
          selector: 'function',
          format: ['camelCase', 'PascalCase'],
        },
      ],
    },
  },
  ...onlyFor(reactFiles, [
    react.configs.flat.recommended,
    react.configs.flat['jsx-runtime'],
    asErrors(reactHooks.configs.flat.recommended),
    asErrors(jsxA11y.flatConfigs.recommended),
  ]),
  {
    files: reactFiles,
    settings: { react: { version: 'detect' } },
    rules: {
      'react/prop-types': 'off',
      'react-hooks/exhaustive-deps': 'error',
      // The repo does not use the React Compiler.
      'react-hooks/incompatible-library': 'off',
      'react-hooks/unsupported-syntax': 'off',
      'react/button-has-type': 'error',
      'react/jsx-boolean-value': 'error',
      'react/jsx-curly-brace-presence': [
        'error',
        { props: 'never', children: 'never' },
      ],
      'react/jsx-no-target-blank': 'error',
      'react/no-array-index-key': 'error',
      'react/no-unstable-nested-components': 'error',
      'react/self-closing-comp': 'error',
      '@typescript-eslint/no-misused-promises': [
        'error',
        { checksVoidReturn: { attributes: false } },
      ],
    },
  },
  {
    files: ['src/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-syntax': [
        'error',
        noEnum,
        noDefaultExport,
        ...noColourLiterals,
      ],
    },
  },
  {
    // Next.js finds these files by their default export.
    files: ['src/app/**/{layout,page,not-found}.tsx'],
    rules: {
      'no-restricted-syntax': ['error', noEnum, ...noColourLiterals],
    },
  },
  {
    files: ['src/**/*.{ts,tsx}', 'e2e/**/*.ts'],
    plugins: { 'check-file': checkFile },
    rules: {
      'check-file/filename-naming-convention': [
        'error',
        { '**/*.{ts,tsx}': 'KEBAB_CASE' },
        { ignoreMiddleExtensions: true },
      ],
      'check-file/folder-naming-convention': [
        'error',
        { 'src/**/': 'KEBAB_CASE', 'e2e/**/': 'KEBAB_CASE' },
      ],
    },
  },
  {
    files: ['**/*.spec.ts', 'e2e/**/*.ts'],
    plugins: { vitest },
    rules: {
      ...vitest.configs.recommended.rules,
      'max-lines-per-function': 'off',
      'max-nested-callbacks': 'off',
      // Specs assert token values, so they may spell colours out.
      'no-restricted-syntax': ['error', noEnum, noDefaultExport],
    },
  },
  {
    // Playwright tests are not Vitest tests.
    files: ['e2e/**/*.ts'],
    rules: Object.fromEntries(
      Object.keys(vitest.configs.recommended.rules).map((name) => [name, 'off'])
    ),
  },
  {
    files: ['**/*.mjs', '**/*.js'],
    ...tseslint.configs.disableTypeChecked,
  },
  eslintConfigPrettier,
];
