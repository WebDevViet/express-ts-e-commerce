// build.js
import { builtinModules } from 'module'

try {
  const buildResult = await Bun.build({
    // Đặt entry point giống như trong rollup.config.mjs
    entrypoints: ['src/app.ts'],
    // build cho môi trường server dùng bun
    target: 'bun',
    // Thư mục xuất ra kết quả build
    outdir: 'dist',
    // Sử dụng định dạng CommonJS cho Node.js
    format: 'cjs',
    // Tạo sourcemap (chế độ "linked" tạo file .js.map bên cạnh file JS)
    sourcemap: 'linked',
    // Đánh dấu các module không được bundle (để Node tự load)
    external: [
      ...builtinModules, // các modules nội sinh như fs, path,...
      'express',
      'bcrypt',
      'mongodb'
    ],
    // Loader cấu hình cách xử lý các extension file
    loader: {
      '.ts': 'ts', // Bun tích hợp hỗ trợ chuyển đổi TypeScript
      '.js': 'js',
      '.json': 'json' // Tương tự như plugin json của Rollup
    },
    minify: true
    // Bạn có thể bổ sung thêm các tùy chọn khác như minify, banner,...
  })

  if (!buildResult.success) {
    console.error('Build thất bại:', buildResult.logs)
    process.exit(1)
  }
} catch (err) {
  console.error('Có lỗi trong quá trình build:', err)
  process.exit(1)
}
