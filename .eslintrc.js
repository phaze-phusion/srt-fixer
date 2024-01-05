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
    ecmaVersion: 6,
    sourceType: 'module',
    ecmaFeatures: {
      modules: true,
      impliedStrict: true,
    }
  },
  extends: [
    'eslint:recommended',
  ],
  plugins: [],
  env: {
    es6: true,
    browser: true,
    commonjs: true,
  },
  ignorePatterns: [
    'dist/',
    'node_modules/',
  ],
  rules: {},
};
