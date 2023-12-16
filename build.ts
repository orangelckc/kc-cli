Bun.build({
  entrypoints: ['src/cli.ts'],
  outdir: 'output',
  target: 'node',
  minify: true,
  splitting: true,
  sourcemap: 'none',
  external: [
    'axios',
    'chalk',
    'commander',
    'figlet',
    'inquirer',
    'ora',
  ],
})
