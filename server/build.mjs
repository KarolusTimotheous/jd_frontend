import { build } from "esbuild"
await build({
  entryPoints: ["server/argos.mjs"],
  outfile: "server-bundle.mjs",
  bundle: true,
  platform: "node",
  format: "esm",
  target: "node22",
  minify: true,
})
console.log("Bundled public-data adapter.")
