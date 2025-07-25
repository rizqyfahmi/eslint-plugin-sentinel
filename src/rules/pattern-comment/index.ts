import { ESLintUtils } from "@typescript-eslint/utils"

const createRule = ESLintUtils.RuleCreator(name => name)

type Options = [{ allowPattern: string }]
type MessageIds = "unexpectedComment"

export default createRule<Options, MessageIds>({
    name: "pattern-comment",
    meta: {
        type: "problem",
        docs: {
            description: "Disallow all comments except those matching a given regex",
        },
        messages: {
            unexpectedComment: "Unexpected comment: does not match allowed format.",
        },
        schema: [
            {
                type: "object",
                properties: {
                    allowPattern: {
                        type: "string",
                    },
                },
                additionalProperties: false,
            },
        ],
    },
    defaultOptions: [{
        allowPattern: "^\\*?\\s*((TODO|FIXME|NOTE|BUG|HACK|OPTIMIZE|REVIEW|SECURITY):|@(public|private|deprecated))"
    }],
    create: (context, [{ allowPattern }]) => {
        const regex = new RegExp(allowPattern)

        return {
            "Program": () => {
                const sourceCode = context.getSourceCode()
                const comments = sourceCode.getAllComments()

                for (const comment of comments) {
                    const trimmed = comment.value.trim()
                    if (!regex.test(trimmed)) {
                        context.report({
                            loc: comment.loc,
                            messageId: "unexpectedComment",
                            data: { pattern: allowPattern },
                        })
                    }
                }
            },
        }
    },
})
