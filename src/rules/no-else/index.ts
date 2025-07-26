import { ESLintUtils, TSESTree } from "@typescript-eslint/utils"

const createRule = ESLintUtils.RuleCreator((name) => name)

const rule = createRule({
    name: "no-else",
    meta: {
        type: "suggestion",
        docs: {
            description: "Disallow use of 'else' blocks. Allow 'else if'. Prefer early return or guard clauses.",
        },
        messages: {
            noElse: "Avoid using 'else'. Prefer early return or guard clauses.",
        },
        schema: [],
    },
    defaultOptions: [],
    create: (context): ESLintUtils.RuleListener => {
        const check = (node: TSESTree.IfStatement) => {
            // Check if there is an alternate and it is NOT another IfStatement (i.e., it's a real `else`)
            if (node.alternate && node.alternate.type !== "IfStatement") {
                context.report({
                    node: node.alternate,
                    messageId: "noElse",
                })
            }
        }

        return {
            IfStatement: check,
        }
    },
})

export default rule
