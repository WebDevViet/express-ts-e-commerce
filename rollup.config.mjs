// rollup.config.mjs
import commonjs from '@rollup/plugin-commonjs'
import json from '@rollup/plugin-json'
import resolve from '@rollup/plugin-node-resolve'
import terser from '@rollup/plugin-terser'
import typescript from '@rollup/plugin-typescript'
import { builtinModules } from 'module'

const externalLibs = [
  ...builtinModules, // fs, path, etc.
  'express',
  'bcrypt',
  'mongodb'
]

export default {
  input: 'src/app.ts', // điểm entry của dự án
  output: {
    file: 'dist/app.js',
    format: 'cjs', // commonjs cho Node.js
    sourcemap: true
  },
  external: externalLibs, // đánh dấu external cho thư viện đã nêu
  plugins: [
    json(),
    resolve({
      extensions: ['.js', '.ts'],
      preferBuiltins: true,
      exportConditions: ['node']
    }),
    commonjs(),
    typescript({
      tsconfig: './tsconfig.json'
    }),
    terser({
      // compress: {
      //   drop_console: true // Loại bỏ console.log
      // },
      format: {
        comments: false // Xóa tất cả comment trong file minified
      }
    })
  ]
}
