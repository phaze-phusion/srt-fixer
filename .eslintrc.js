module.exports = {
  root: true,
  parser: '@babel/eslint-parser',
  parserOptions: {
    requireConfigFile: false,
    babelOptions: {
      babelrc: false,
      configFile: false,
      presets: ["@babel/preset-env"],
    },
    ecmaVersion: 2018,
    sourceType: 'module',
    ecmaFeatures: {
      modules: true,
      impliedStrict: true,
    }
  },
  plugins: [
  ],
  extends: [
    'eslint:recommended',
  ],
  env: {
    es6: true,
    browser: true,
    commonjs: true,
  },
  ignorePatterns: [
    'dist/',
    'node_modules/',
  ],
  rules: {
    'no-control-regex': 'off',
    'no-unused-vars': [
      'error', // or "error"
      {
        'argsIgnorePattern': '^_',
      }
    ]
  },
};
