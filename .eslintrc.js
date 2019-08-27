module.exports = {
  extends: "eslint:recommended",
  env: {
    browser: true,
    es6: true,
    node: true,
  },
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
     'indent': ['error', 3, { "SwitchCase": 1 }],
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
     'no-throw-literal': 'off',
     'comma-dangle': 'off',
     'object-curly-spacing': 'off',
     'max-len': 'off',
     "eqeqeq": ['error', 'always'],
     "no-undef": 'error',
     "prefer-const": ["error", {
        "destructuring": "any",
        "ignoreReadBeforeAssign": false
    }],
    "operator-linebreak": ["error", "before"],
    "no-cond-assign": "error"
  },
}
