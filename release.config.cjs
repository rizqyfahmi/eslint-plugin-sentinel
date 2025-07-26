module.exports = {
    branches: ["master"],
    plugins: [
        [
            "@semantic-release/commit-analyzer",
            {
                releaseRules: [
                    { type: "fix", release: "patch" },
                    { type: "build", release: "patch" },
                    { type: "chore", release: "patch" },
                    { type: "ci", release: "patch" },
                    { type: "docs", release: "patch" },
                    { type: "style", release: "patch" },
                    { type: "perf", release: "patch" }
                ]
            }
        ],
        [
            "@semantic-release/release-notes-generator",
            {
                preset: "conventionalcommits",
                presetConfig: {
                    types: [
                        { type: "feat", section: "✨ Features" },
                        { type: "fix", section: "🐛 Bug Fixes" },
                        { type: "ci", section: "⚙️ CI/CD", hidden: false },
                        { type: "chore", section: "🔧 Maintenance", hidden: false },
                        { type: "docs", section: "📝 Documentation", hidden: false },
                        { type: "style", section: "💅 Styling", hidden: false },
                        { type: "perf", section: "⚡ Performance", hidden: false },
                        { type: "build", section: "🏗 Build", hidden: false }
                    ]
                }
            }
        ],
        [
            "@semantic-release/changelog",
            {
                changelogFile: "CHANGELOG.md"
            }
        ],
        "@semantic-release/npm",
        "@semantic-release/github",
        [
            "@semantic-release/git",
            {
                assets: ["package.json", "CHANGELOG.md"],
                message:
                    "chore(release): ${nextRelease.version} [skip ci]\n\n${nextRelease.notes}"
            }
        ]
    ]
}
