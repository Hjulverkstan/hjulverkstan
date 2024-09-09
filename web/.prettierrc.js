import baseConfig from '../.prettierrc.js';

export default {
  ...baseConfig,
  plugins: [
    'prettier-plugin-tailwindcss',
    'prettier-plugin-classnames',
    'prettier-plugin-merge',
  ],
  tailwindAttributes: ['className', 'classNames'],
  tailwindFunctions: ['clsx', 'cla', 'cva'],
  customAttributes: ['className', 'classNames'],
  customFunctions: ['clsx', 'cla', 'cva'],
};
