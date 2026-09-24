import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {defineConfig} from 'vite';
import {hydrogen} from '@shopify/hydrogen/vite';
import {oxygen} from '@shopify/mini-oxygen/vite';
import {reactRouter} from '@react-router/dev/vite';
import tsconfigPaths from 'vite-tsconfig-paths';

const rootDir = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  resolve: {
    alias: {
      '~': path.join(rootDir, 'app'),
      '@fsd': path.join(rootDir, 'src/fsd'),
    },
  },
  plugins: [hydrogen(), oxygen(), reactRouter(), tsconfigPaths()],
  build: {
    // Allow a strict Content-Security-Policy
    // without inlining assets as base64:
    assetsInlineLimit: 0,
  },
  optimizeDeps: {
    exclude: ['@dalshenekuda/candy-ui'],
  },
  ssr: {
    // Bundled by Oxygen (noExternal: true). Do not externalize —
    // workerd cannot resolve file: linked packages (No such module ui-kit.js).
    // Keep excluded from optimizeDeps to avoid Dynamic require of react.
    optimizeDeps: {
      exclude: ['@dalshenekuda/candy-ui'],
      /**
       * Include dependencies here if they throw CJS<>ESM errors.
       * Do not include @dalshenekuda/candy-ui.
       */
      include: ['set-cookie-parser', 'cookie', 'react-router'],
    },
  },
  server: {
    allowedHosts: ['.tryhydrogen.dev'],
    fs: {
      // CandyUI's build/ ships fonts as real files (not base64), referenced
      // via url() from style.css. When CandyUI is linked locally as a
      // sibling repo (file:../CandyUI, see README), that CSS resolves to a
      // path outside this project root, which Vite's dev server blocks by
      // default. Not needed once the app depends on the npm-published
      // package (those files live inside this project's own node_modules).
      allow: ['..'],
    },
  },
});
