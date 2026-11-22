import esbuild from "esbuild";

export const prerender = true;

export async function GET() {
  const { outputFiles } = esbuild.buildSync({
    entryPoints: ["./src/audio-worklet.ts"],
    bundle: true,
    minify: true,
    write: false,
  });
  return new Response(outputFiles[0].contents as BodyInit, {
    // Worklet fetches require a JavaScript MIME type and Chrome does not
    // sniff: without this header, dev-mode addModule() fails with AbortError
    // (prod only works because the prerendered route is served as a static
    // .js file with the correct Content-Type).
    headers: { "Content-Type": "text/javascript; charset=utf-8" },
  });
}
