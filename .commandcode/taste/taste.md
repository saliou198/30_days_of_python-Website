# Taste

- User teaches programming (Python) to beginners; wants learning materials and repos structured in a clear, progressive, ordered sequence rather than as an unorganized collection. Confidence: 0.7
- Prefers Next.js (App Router) when turning repos or content collections into websites. Confidence: 0.7
- Machine environment: `NODE_ENV=production` is exported in the user's shell session, so `npm install`/`npm ci` silently skip devDependencies — install with `--include=dev` (or `NODE_ENV=development`) or builds will break. Confidence: 0.85
- Machine environment: the user's home directory contains its own `package.json`/`package-lock.json`, which can interfere with npm installs and Turbopack root detection (workaround: set `turbopack.root` in next.config.ts). Confidence: 0.8
- Uses Neovim with the Tokyo Night color scheme as their editor. Confidence: 0.6
