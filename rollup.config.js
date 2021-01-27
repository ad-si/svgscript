import { nodeResolve } from '@rollup/plugin-node-resolve'

export default {
  input: './public/scripts/index.js',
  output: {
    file: './public/scripts/bundle.js',
    format: 'iife',
  },
  // external: ['assert'],
  plugins: [nodeResolve()],
}
