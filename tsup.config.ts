// tsup.config.ts
import { defineConfig } from "tsup";

export default defineConfig({
  entry: {
    "engine/index": "src/engine/index.ts",
    "symbols/index": "src/symbols/index.ts",
    "symbols/individual/index": "src/symbols/catalog/individual/index.ts",
    "adapter/index": "src/adapter/types.ts",
    "core/index": "src/core/index.ts",
    "maplibre/index": "src/maplibre/index.ts",
    "react/index": "src/react/index.ts",
  },
  format: ["esm", "cjs"],
  dts: true,
  sourcemap: true,
  clean: true,
  splitting: true,      // <-- back to true: forces shared modules (engine/registry.ts)
                         //     to be emitted as ONE shared chunk that every entry
                         //     imports, instead of N independent copies.
  treeshake: true,
  external: ["maplibre-gl", "react", "react-dom"],
});