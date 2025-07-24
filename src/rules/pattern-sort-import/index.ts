import { TSESTree } from "@typescript-eslint/types"
import { ESLintUtils } from "@typescript-eslint/utils"

type MessageIds = "unsorted"
type Options = [string[]]

const createRule = ESLintUtils.RuleCreator(name => name)

const rule = createRule<Options, MessageIds>({
    name: "pattern-sort-import",
    meta: {
        type: "suggestion",
        docs: {
            description: "Sort imports by group with no intra-group reorder"
        },
        fixable: "code",
        schema: [
            {
                type: "array",
                items: { type: "string" },
                minItems: 0,
            },
        ],
        messages: {
            unsorted: "Imports should be sorted by the configured group order.",
        },
    },
    defaultOptions: [[]],
    create: (context, [groups]) => {
        return {
            Program: (node) => {
                const sourceCode = context.sourceCode
                const imports = node.body.filter(
                    n => n.type === "ImportDeclaration",
                ) as TSESTree.ImportDeclaration[]
                if (imports.length <= 1) return

                const getGroupIndex = (path: string, groups: string[]): number => {
                    const idx = groups.findIndex(pattern => new RegExp(pattern).test(path))
                    return idx >= 0 ? idx : groups.length
                }

                // Annotate each import with its original position and regex group
                const withMeta = imports.map((imp, i) => ({
                    imp,
                    originalIndex: i,
                    groupIndex: getGroupIndex(imp.source.value as string, groups),
                }))

                // Sort: first by groupIndex, then by originalIndex (preserves grouping & order)
                const sorted = [...withMeta].sort((a, b) => {
                    const g = a.groupIndex - b.groupIndex
                    return g !== 0 ? g : a.originalIndex - b.originalIndex
                })

                const isSame = sorted.every((entry, i) => entry.imp === withMeta[i].imp)
                if (isSame) return

                context.report({
                    node: imports[0],
                    messageId: "unsorted",
                    fix: fixer => {
                        const newText = sorted
                            .map(entry => sourceCode.getText(entry.imp))
                            .join("\n")
                        const first = imports[0]
                        const last = imports[imports.length - 1]
                        return fixer.replaceTextRange([first.range[0], last.range[1]], newText)
                    },
                })
            },
        }
    },
})

export default rule
