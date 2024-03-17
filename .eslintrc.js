module.exports = {
    root: true,
    env: {
        "node": true,
        "browser": true
    },
    extends: [
        'eslint:recommended'
    ],
    parserOptions: {
        sourceType: "module",
        ecmaVersion: 2015,
        parser: '@babel/eslint-parser'
    },
    rules: {
        'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'warn',
        'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'warn',
        'no-unused-vars': process.env.NODE_ENV === 'production' ? 'error' : 'warn'
    }
}
