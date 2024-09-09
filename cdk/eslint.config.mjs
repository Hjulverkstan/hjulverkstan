import globals from 'globals';
import js from '@eslint/js';
import ts from 'typescript-eslint';
import prettier from 'eslint-config-prettier';

import createBaseConfig from '../eslint.base.mjs';

const baseConfig = createBaseConfig({ globals, js, ts, prettier });

export default [
    ...baseConfig,
    { ignores: ['.prettierrc.cjs'] }
];
