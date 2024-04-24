const throwErr = (name, prop) => {
  throw new Error(`
  ! ${prop} is undefined and should be passed to the eslint.base.mjs function.
  ! Resolve it by importing and passing it in the props:
  !
  ! import ${prop} from '${name}';
  ! import createBaseConfig from 'path-to-eslint.base.mjs';
  !
  ! const baseConfig = createBaseConfig({ ${prop}, ... });
  ! export default baseConfig;`)
};

export default ({ globals, js, ts, react, prettier }) => {
  if (!globals) throwErr('globals', 'globals')
  if (!js) throwErr('@eslint/js', 'js')
  if (!ts) throwErr('typescript-eslint', 'ts')
  if (!prettier) throwErr('eslint-config-prettier', 'prettier')

  if (!react) console.log(`You have not passed react from 'eslint-plugin-react'. If you are using in your project please import it and pass it to the eslint.base.mjs function in your eslint config`);

  return [
    {
      languageOptions: {
        globals: { ...globals.browser, ...globals.node },
      },
      files: ['**/*.{js,jsx,ts,tsx}'],
      plugins: { react },
      rules: {
        "react/prop-types": "off",
        "react/no-unknown-property": "off",
        "react/react-in-jsx-scope": "off",
      }
    },
    ...ts.config(
      js.configs.recommended,
      ...ts.configs.recommended,
    ),
    {
      rules: {
      // Set to warn in the future and start to clean of any types. If you have the time...
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/prefer-as-const': 'off',
      /* '@typescript-eslint/no-unused-vars': 'off', */
      '@typescript-eslint/no-unused-vars': ['error', { 
        'ignoreRestSiblings': true,
        'varsIgnorePattern': '^_', 
        'argsIgnorePattern': '^_',
       }],
      },
    },
    prettier,
  ];
};
