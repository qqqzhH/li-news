import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // sync-news.mjs 生成的数据文件（勿手改，单源是 src/data/news.json）
    "src/lib/news.ts",
    "src/lib/news-*.ts",
  ]),
  {
    // scripts/ 是 Node CommonJS 运维脚本（fetch-news.js 等），require/module.exports 天经地义
    files: ["scripts/**/*.js"],
    rules: {
      "@typescript-eslint/no-require-imports": "off",
    },
  },
]);

export default eslintConfig;
