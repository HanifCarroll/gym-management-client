module.exports = {
  semi: true,
  singleQuote: true,
  trailingComma: 'all',
  printWidth: 80,
  tabWidth: 2,
  plugins: ['@trivago/prettier-plugin-sort-imports'],
  importOrder: [
    '^@src/core(.*)$',
    '^@src/infrastructure(.*)$',
    '^@src/app(.*)$',
    '^@/(.*)$',
    '^[^@\\.].+$',
    '^\\.[./]*$',
    '^\\.{3,}/',
  ],
  importOrderSeparation: false,
  importOrderSortSpecifiers: true,
};
