module.exports = {
  env: {
    browser: true,
    es6: true,
    node: true,
  },
  extends: [
    'airbnb-base',
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly'
  },
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  rules: {
     'semi': ['error', 'never'],
     'indent': ['error', 3],
     'class-methods-use-this': 'off',
     'global-require': 'off',
     'no-param-reassign': 'off',
     'arrow-parens': 'off',
     'object-shorthand': 'off',
     'no-restricted-syntax': 'off',
     'object-property-newline': 'off',
     'no-continue': 'off',
     'no-cond-assign': 'off',
     'guard-for-in': 'off',
     'no-console': 'warn',
     'object-curly-newline': 'off',
     'no-console': 'off',
     'prefer-template': 'off',
     'max-classes-per-file': 'off',
     'arrow-body-style': 'off',
     'func-names': 'off',
     'no-throw-literal': 'off'
  },
};
