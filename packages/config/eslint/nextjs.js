/** @type {import("eslint").Linter.Config} */
module.exports = {
  extends: [
    './base.js',
    'next/core-web-vitals'
  ],
  env: {
    browser: true,
    node: true,
    es2022: true
  },
  rules: {
    'react/react-in-jsx-scope': 'off',
    'react/prop-types': 'off',
    '@next/next/no-html-link-for-pages': 'off'
  }
};
