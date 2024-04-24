import globals from 'globals';
import js from '@eslint/js';
import ts from 'typescript-eslint';
import react from 'eslint-plugin-react';
import prettier from 'eslint-config-prettier';

import createBaseConfig from '../eslint.base.mjs';

const baseConfig = createBaseConfig({ globals, js, ts, react, prettier });

export default baseConfig;
