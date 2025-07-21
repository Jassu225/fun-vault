// eslint.config.js

import { defineConfig } from 'eslint/config';

export default defineConfig([
  {
    extends: ['next/core-web-vitals', 'prettier'],
  },
]);
