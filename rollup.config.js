import typescript from '@rollup/plugin-typescript';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import dts from 'rollup-plugin-dts';

const commonConfig = {
  input: 'src/index.ts',
  plugins: [
    resolve({
      browser: true,
      preferBuiltins: false,
    }),
    commonjs(),
    typescript({
      tsconfig: './tsconfig.json',
      declaration: false,
      declarationDir: undefined,
    }),
  ],
  external: ['typescript'],
};

export default [
  // ESM build
  {
    ...commonConfig,
    output: {
      file: 'dist/index.mjs',
      format: 'es',
      sourcemap: true,
    },
  },

  // CommonJS build
  {
    ...commonConfig,
    output: {
      file: 'dist/index.cjs',
      format: 'cjs',
      sourcemap: true,
    },
  },

  // Type definitions build
  {
    input: 'src/index.ts',
    output: {
      file: 'dist/index.d.ts',
      format: 'es',
    },
    plugins: [dts()],
  },
];
