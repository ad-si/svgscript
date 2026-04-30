import { nodeResolve } from "@rollup/plugin-node-resolve"
import typescript from "@rollup/plugin-typescript"

export default {
  input: "./public/scripts/index.ts",
  output: {
    file: "./public/scripts/bundle.js",
    format: "iife",
  },
  plugins: [
    nodeResolve(),
    typescript({
      tsconfig: "./tsconfig.rollup.json",
    }),
  ],
}
