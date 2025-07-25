import { ESLintUtils, TSESTree } from "@typescript-eslint/utils"

type Options = [{
    maxElseIf?: number
    maxCase?: number
}]

type MessageIds = "tooManyElseIf" | "disallowedElseIf" | "tooManyCases" | "disallowedCases"

const defaultOptions = {
    maxElseIf: 2,
    maxCase: 5,
}

const createRule = ESLintUtils.RuleCreator((name) => name)

const rule = createRule<Options, MessageIds>({
    name: "max-alternative-conditionals",
    meta: {
        type: "suggestion",
        docs: {
            description: "Limit number of else-if and switch-case branches",
        },
        messages: {
            tooManyElseIf: "Exceeded maximum allowed else-if branches (max: {{maxElseIf}}).",
            disallowedElseIf: "Usage of else-if is disallowed.",
            tooManyCases: "Exceeded maximum allowed switch cases (max: {{maxCase}}).",
            disallowedCases: "Usage of switch cases is disallowed.",
        },
        schema: [
            {
                type: "object",
                properties: {
                    maxElseIf: { type: "number", minimum: 0 },
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
                let current = node.alternate

                // Count only 'else if' chains
                while (current && current.type === "IfStatement") {
                    elseIfCount++
                    current = current.alternate
                }

                if (elseIfCount > options.maxElseIf) {
                    context.report({
                        node,
                        messageId: options.maxElseIf === 0 ? "disallowedElseIf" : "tooManyElseIf",
                        data: { maxElseIf: options.maxElseIf },
                    })
                }
            },

            SwitchStatement: (node: TSESTree.SwitchStatement) => {
                let caseCount = node.cases.length

                // Exclude default case from the count
                const hasDefaultCase = node.cases.some(
                    (c) => c.test === null
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