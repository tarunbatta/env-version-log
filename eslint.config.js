// eslint.config.js
import tsParser from '@typescript-eslint/parser';

export default [
  {
    files: ['**/*.ts'], // Target TypeScript files
    languageOptions: {
      parser: tsParser,
    },
    rules: {
      // Add your rules here
    },
  },
];
