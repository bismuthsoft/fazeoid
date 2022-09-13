import esbuild from 'esbuild';

export const prerender = true;

export async function GET() {
  const { errors, warnings, outputFiles } = esbuild.buildSync({
    entryPoints: ['./src/audio-worklet.ts'],
    bundle: true,
    minify: true,
    write: false,
  });
  return new Response(outputFiles[0].contents);
}
