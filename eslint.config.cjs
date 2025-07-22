const parser = require("@typescript-eslint/parser");
const eslintPlugin = require("@typescript-eslint/eslint-plugin");
const stylistic = require("@stylistic/eslint-plugin");

const eslintConfig = [
    {
        files: ["**/*.ts"],
        languageOptions: {
            parser,
            parserOptions: {
                ecmaVersion: "latest",
                sourceType: "module",
                project: "./tsconfig.json",
            },
        },
        plugins: {
            "@typescript-eslint": eslintPlugin,
            "@stylistic": stylistic,
        },
        rules: {
            ...eslintPlugin.configs.recommended.rules,
            "@stylistic/comma-spacing": ["error", { before: false, after: true }],
            "@stylistic/indent": ["error", 4],
            "@stylistic/key-spacing": ["error"],
            "@stylistic/space-before-blocks": "error",
            "@stylistic/quotes": ["error", "double"],
            "@stylistic/no-multi-spaces": "error",
            "@stylistic/no-trailing-spaces": "error",
            "@stylistic/semi": ["error", "never"],
            "@stylistic/space-before-function-paren": [
                "error",
                { asyncArrow: "ignore" },
            ],
        },
    },
];

module.exports = eslintConfig;
