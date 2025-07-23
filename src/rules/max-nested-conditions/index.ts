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

        const isElseIf = (node: TSESTree.Node, parent?: TSESTree.Node): boolean => {
            return node.type === "IfStatement" && parent?.type === "IfStatement" && (parent as TSESTree.IfStatement).alternate === node
        }

        const enter = (node: TSESTree.Node) => {
            const parent = node.parent as TSESTree.Node | undefined
            const parentDepth = depthStack[depthStack.length - 1] ?? 0

            if (!CONDITIONAL_TYPES.has(node.type)) {
                depthStack.push(parentDepth)
                return
            }

            const newDepth = isElseIf(node, parent) ? parentDepth : parentDepth + 1
            depthStack.push(newDepth)

            if (newDepth > maxDepth) {
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
