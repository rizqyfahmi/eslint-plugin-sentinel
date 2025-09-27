import { ESLintUtils, TSESTree } from "@typescript-eslint/utils"

const createRule = ESLintUtils.RuleCreator(name => name)

type Options = [string[]]

type MessageIds = "restrictedImport"

const rule = createRule<Options, MessageIds>({
    name: "pattern-restricted-import",
    meta: {
        type: "problem",
        docs: {
            description: "Disallow import paths matching certain regex patterns",
        },
        messages: {
            restrictedImport: "Import path '{{importPath}}' matches a restricted pattern '{{pattern}}'.",
        },
        schema: [
            {
                type: "array",
                items: { type: "string" },
                minItems: 0,
            },
        ],
    },
    defaultOptions: [[]], // default to empty array
    create: (context) => {
        // Now context.options[0] is an array of strings, or undefined
        const rawPatterns = context.options[0] || []

        // Convert all string patterns to RegExp objects
        const patterns = rawPatterns.map((pattern) => new RegExp(pattern))

        return {
            "ImportDeclaration": (node: TSESTree.ImportDeclaration) => {
                const importPath = node.source.value

                for (const pattern of patterns) {
                    if (pattern.test(importPath)) {
                        context.report({
                            node: node.source,
                            messageId: "restrictedImport",
                            data: {
                                importPath,
                                pattern: pattern.toString(),
                            },
                        })
                    }
                }
            },
        }
    },
})

export default rule
