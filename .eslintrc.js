module.exports = {
  parser: '@typescript-eslint/parser',
  extends: [
    'eslint:recommended',
  ],
  plugins: [],
  rules: {
    // Add only basic rules
    'no-unused-vars': 'warn',
    'no-console': 'off',
  },
  env: {
    browser: true,
    node: true,
    es6: true
  },
  ignorePatterns: [
    'node_modules/',
    '.next/',
    'out/'
  ],
  settings: {
    react: {
      version: 'detect',
    },
  },
};
