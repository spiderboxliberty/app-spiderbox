import { createDemoServer } from './app';

const port = Number(process.env.PORT ?? 3001);
if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error('PORT invalide.');
const server = createDemoServer({
  mode: process.env.APP_MODE ?? '',
  distDir: new URL('../dist', import.meta.url).pathname,
});
server.listen(port, '127.0.0.1', () =>
  console.log(`SpiderBox Liberty · démonstration locale · port ${port} · données volatiles`),
);
for (const signal of ['SIGINT', 'SIGTERM'] as const)
  process.on(signal, () => server.close(() => process.exit(0)));
