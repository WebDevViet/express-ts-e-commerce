import globals from 'globals'
import pluginJs from '@eslint/js'
import tseslint from 'typescript-eslint'
import eslintPluginPrettier from 'eslint-plugin-prettier'

/** @type {import('eslint').Linter.Config[]} */
export default [
  { files: ['**/*.{js,mjs,cjs,ts}'] },
  { languageOptions: { globals: globals.node } },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  {
    plugins: {
      prettier: eslintPluginPrettier
    },
    rules: {
      // Cảnh báo đang sử dụng debugger
      'no-debugger': 'warn',

      // Cảnh báo đang sử dụng console
      'no-console': 'warn',

      // Cảnh báo nếu xuống hàng nhiều hơn 1 dòng
      'no-multiple-empty-lines': ['warn', { max: 1 }],

      // Cảnh báo khi sử dụng loại 'any' trong TypeScript
      '@typescript-eslint/no-explicit-any': 'off',

      // Cảnh báo khi có biến không được sử dụng
      '@typescript-eslint/no-unused-vars': 'warn',

      '@typescript-eslint/no-empty-object-type': 'off',

      // Cấu hình Prettier để định dạng mã nguồn
      'prettier/prettier': [
        'warn', // Cảnh báo cho các vấn đề của Prettier
        {
          semi: false,
          // Sử dụng dấu nháy đơn cho chuỗi
          singleQuote: true,
          // Sử dụng dấu nháy đơn trong JSX
          trailingComma: 'none',
          // Giới hạn độ dài dòng là 120 ký tự
          printWidth: 120,
          // Sử dụng 2 khoảng trắng để thụt đầu dòng
          tabWidth: 2,
          // Giữ nguyên các kết thúc dòng hiện có
          endOfLine: 'auto'
        }
      ]
    },
    ignores: ['**/node_modules/', '**/dist/']
  }
]
