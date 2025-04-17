// rollup.config.mjs
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import typescript from '@rollup/plugin-typescript'
import json from '@rollup/plugin-json'
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
      preferBuiltins: true
    }),
    commonjs(),
    typescript({
      tsconfig: './tsconfig.json'
    })
  ]
}
