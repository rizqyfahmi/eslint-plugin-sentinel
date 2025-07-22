import { ESLintUtils, TSESTree } from "@typescript-eslint/utils"

const createRule = ESLintUtils.RuleCreator(name => name)
const minimum = 1
const rule = createRule({
    name: "max-nested-loops",
    meta: {
        type: "suggestion",
        docs: {
            description: "Disallow deeply nested loops",
        },
        messages: {
            tooDeep: "Too many nested loops (max depth is {{maxDepth}}).",
        },
        schema: [
            {
                type: "object",
                properties: {
                    maxDepth: {
                        type: "number",
                        minimum: minimum,
                    },
                },
                additionalProperties: false,
            },
        ],
    },
    defaultOptions: [{}],
    create: (context, [options]) => {
        const maxDepth = (options as { maxDepth?: number }).maxDepth ?? minimum
        let loopDepth = 0

        const enterLoop = (node: TSESTree.Node) => {
            loopDepth++
            if (loopDepth > maxDepth) {
                context.report({
                    node,
                    messageId: "tooDeep",
                    data: {
                        maxDepth,
                    },
                })
            }
        }

        const exitLoop = () => {
            loopDepth--
        }

        return {
            ForStatement: enterLoop,
            WhileStatement: enterLoop,
            DoWhileStatement: enterLoop,
            ForInStatement: enterLoop,
            ForOfStatement: enterLoop,

            "ForStatement:exit": exitLoop,
            "WhileStatement:exit": exitLoop,
            "DoWhileStatement:exit": exitLoop,
            "ForInStatement:exit": exitLoop,
            "ForOfStatement:exit": exitLoop,
        }
    },
})

export default rule
