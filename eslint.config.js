import { defineConfig, globalIgnores } from 'eslint/config'
import globals from 'globals'
import pluginJs from '@eslint/js'
import tsPlugin from '@typescript-eslint/eslint-plugin'
import tsParser from '@typescript-eslint/parser'
import eslintPluginPrettier from 'eslint-plugin-prettier'

export default defineConfig([
  // Cấu hình globalIgnores cho ESLint bỏ qua các thư mục chỉ định
  globalIgnores(['**/node_modules/', 'dist/']),
  {
    // Xác định các file mục tiêu
    files: ['**/*.{js,mjs,cjs,ts}'],
    languageOptions: {
      globals: globals.node,
      // Sử dụng parser của @typescript-eslint để hỗ trợ TypeScript
      parser: tsParser,
      parserOptions: {
        // Nếu bạn có file tsconfig.json thì có thể chỉ định ở đây để cung cấp thêm thông tin cho parser
        project: './tsconfig.json'
      }
    },
    plugins: {
      js: pluginJs,
      prettier: eslintPluginPrettier,
      '@typescript-eslint': tsPlugin
    },
    extends: [pluginJs.configs.recommended, '@typescript-eslint/recommended'],
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
    ignores: ['build.js', 'rollup.config.mjs', 'eslint.config.js', 'commitlint.config.js']
  }
])
