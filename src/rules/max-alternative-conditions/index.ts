import { ESLintUtils, TSESTree } from "@typescript-eslint/utils"

type Options = [{
    maxElseIf?: number
    maxElse?: number
    maxCase?: number
}]

type MessageIds = "tooManyElseIf" | "disallowedElseIf" | "disallowedElse" | "tooManyCases" | "disallowedCases"

const defaultOptions = {
    maxElseIf: 2,
    maxElse: 1,
    maxCase: 5,
}

const createRule = ESLintUtils.RuleCreator((name) => name)

const rule = createRule<Options, MessageIds>({
    name: "max-alternative-conditionals",
    meta: {
        type: "suggestion",
        docs: {
            description: "Limit number of else-if, else, and switch-case branches"
        },
        messages: {
            tooManyElseIf: "Exceeded maximum allowed else-if branches (max: {{maxElseIf}}).",
            disallowedElseIf: "Usage of else-if is disallowed.",

            disallowedElse: "Usage of else is disallowed.",

            tooManyCases: "Exceeded maximum allowed switch cases (max: {{maxCase}}).",
            disallowedCases: "Usage of switch cases is disallowed.",
        },
        schema: [
            {
                type: "object",
                properties: {
                    maxElseIf: { type: "number", minimum: 0 },
                    maxElse: { type: "number", minimum: 0 },
                    maxCase: { type: "number", minimum: 0 },
                },
                additionalProperties: false,
            },
        ],
    },
    defaultOptions: [defaultOptions],
    create: (context) => {
        const options = { ...defaultOptions, ...context.options[0] }

        return {
            IfStatement: (node: TSESTree.IfStatement) => {
                let elseIfCount = 0
                let elseCount = 0
                let current = node.alternate

                while (current) {
                    if (current.type === "IfStatement") {
                        elseIfCount++
                        current = current.alternate
                        continue
                    }

                    elseCount++
                    break
                }

                if (elseIfCount > options.maxElseIf) {
                    context.report({
                        node,
                        messageId: options.maxElseIf === 0 ? "disallowedElseIf" : "tooManyElseIf",
                        data: { maxElseIf: options.maxElseIf },
                    })
                    return
                }

                if (elseCount > options.maxElse) {
                    context.report({
                        node,
                        messageId: "disallowedElse",
                        data: { maxElse: options.maxElse },
                    })
                }
            },

            SwitchStatement: (node: TSESTree.SwitchStatement) => {
                let caseCount = node.cases.length
                // Check if there is a 'default' case and uncount it
                const hasDefaultCase = node.cases.some(
                    (c) => c.test === null // The 'test' property is null for a default case
                )

                if (hasDefaultCase) {
                    caseCount--
                }

                if (caseCount > options.maxCase) {
                    context.report({
                        node,
                        messageId: options.maxCase === 0 ? "disallowedCases" : "tooManyCases",
                        data: { maxCase: options.maxCase },
                    })
                }
            },
        }
    },
})

export default rule
