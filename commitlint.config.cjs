const commitlintConfig = {
    extends: ["@commitlint/config-conventional"],
    rules: {
        "type-enum": [
            2,
            "always",
            ["feat", "fix", "build", "chore", "ci", "docs", "style", "refactor", "perf", "test"],
        ],
        "scope-empty": [2, "never"],
        "subject-case": [2, "always", ["sentence-case"]],
        "body-max-line-length": [0, 'always', Infinity]
    },
}

module.exports = commitlintConfig
