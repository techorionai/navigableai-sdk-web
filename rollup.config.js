import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import { terser } from "rollup-plugin-terser";

export default {
  input: "dist/index.js", // Entry point
  output: [
    {
      file: "dist/index.js",
      format: "umd",
      name: "NavigableAI",
      sourcemap: true,
    },
    {
      file: "dist/index.esm.js",
      format: "es",
      sourcemap: true,
    },
  ],
  plugins: [
    resolve(), // Resolve Node.js-style imports
    commonjs(), // Convert CommonJS to ES modules
    terser(), // Minify for smaller builds
  ],
};
