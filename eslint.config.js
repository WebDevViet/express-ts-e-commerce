import { defineConfig, globalIgnores } from 'eslint/config'
import globals from 'globals'
import pluginJs from '@eslint/js'
import tsPlugin from '@typescript-eslint/eslint-plugin'
import tsParser from '@typescript-eslint/parser'
import eslintPluginPrettier from 'eslint-plugin-prettier'

export default defineConfig([
  globalIgnores(['**/node_modules/', 'dist/']),
  {
    files: ['**/*.{js,mjs,cjs,ts}'],
    languageOptions: {
      globals: globals.node,
      parser: tsParser,
      parserOptions: { project: './tsconfig.json' }
    },
    plugins: {
      js: pluginJs,
      prettier: eslintPluginPrettier,
      '@typescript-eslint': tsPlugin
    },
    rules: {
      'no-debugger': 'warn',
      'no-console': 'warn',
      'no-multiple-empty-lines': ['warn', { max: 1 }],
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': 'warn',
      '@typescript-eslint/no-empty-object': 'off',
      'prettier/prettier': [
        'warn',
        { semi: false, singleQuote: true, trailingComma: 'none', printWidth: 120, tabWidth: 2, endOfLine: 'auto' }
      ]
    },
    ignores: [
      '**/node_modules/**',
      'dist/**',
      'build.js',
      'rollup.config.mjs',
      'eslint.config.js',
      'commitlint.config.js'
    ]
  }
])
