import { ESLintUtils, TSESTree } from "@typescript-eslint/utils"

const createRule = ESLintUtils.RuleCreator((name) => name)

const rule = createRule({
    name: "max-nested-conditionals",
    meta: {
        type: "suggestion",
        docs: {
            description: "Limit the depth of nested conditional statements (if, switch, ternary)",
        },
        messages: {
            tooDeep: "Avoid nesting conditional statements deeper than {{maxDepth}} levels.",
        },
        schema: [
            {
                type: "object",
                properties: {
                    maxDepth: {
                        type: "number",
                        minimum: 1,
                        default: 1,
                    },
                },
                additionalProperties: false,
            }
        ]
    },
    defaultOptions: [{ maxDepth: 1 }],
    create: (context, [{ maxDepth }]) => {
        const CONDITIONAL_TYPES = new Set([
            "IfStatement",
            "SwitchStatement",
            "ConditionalExpression",
        ])

        const depthStack: number[] = []

        const enter = (node: TSESTree.Node) => {
            const parentDepth = depthStack[depthStack.length - 1] ?? 0
            const newDepth = CONDITIONAL_TYPES.has(node.type) ? parentDepth + 1 : parentDepth

            depthStack.push(newDepth)

            if (CONDITIONAL_TYPES.has(node.type) && newDepth > maxDepth) {
                context.report({
                    node,
                    messageId: "tooDeep",
                    data: { maxDepth },
                })
            }
        }

        const exit = () => {
            depthStack.pop()
        }

        return {
            "*": enter,
            "*:exit": exit,
        }
    }
})

export default rule
