module.exports = [
  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: 'module'
    },
    rules: {
      'no-console': 'warn',
      indent: ['error', 2]
    }
  }
];
