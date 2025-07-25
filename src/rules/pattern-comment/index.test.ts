import * as NodeTest from "node:test"
import { RuleTester } from "@typescript-eslint/rule-tester"
import rule from "."

RuleTester.afterAll = NodeTest.after
RuleTester.describe = NodeTest.describe
RuleTester.it = NodeTest.it

const options = [
    {
        allowPattern: "^\\*?\\s*((TODO|FIXME|NOTE|BUG|HACK|OPTIMIZE|REVIEW|SECURITY):|@(public|private|deprecated))",
    },
] as const

const ruleTester = new RuleTester({})
describe("pattern-comment rule", () => {
    test("should allow TODO comment", () => {
        ruleTester.run("pattern-comment", rule, {
            valid: [
                {
                    code: "// TODO: refactor this",
                    options: options,
                },
            ],
            invalid: [],
        })
    })

    test("should allow @public block comment", () => {
        ruleTester.run("pattern-comment", rule, {
            valid: [
                {
                    code: "/* @public This is public */",
                    options,
                },
            ],
            invalid: [],
        })
    })

    test("should allow @deprecated JSDoc", () => {
        ruleTester.run("pattern-comment", rule, {
            valid: [
                {
                    code: "/** @deprecated Use another function */",
                    options,
                },
            ],
            invalid: [],
        })
    })

    test("should report normal line comment", () => {
        ruleTester.run("pattern-comment", rule, {
            valid: [],
            invalid: [
                {
                    code: "// Just a normal comment",
                    options,
                    errors: [
                        {
                            messageId: "unexpectedComment",
                            data: {
                                pattern: options[0].allowPattern,
                            },
                        },
                    ],
                },
            ],
        })
    })

    test("should report normal block comment", () => {
        ruleTester.run("pattern-comment", rule, {
            valid: [],
            invalid: [
                {
                    code: "/* Random block comment */",
                    options,
                    errors: [
                        {
                            messageId: "unexpectedComment",
                        },
                    ],
                },
            ],
        })
    })

    test("should report JSDoc without allowed tag", () => {
        ruleTester.run("pattern-comment", rule, {
            valid: [],
            invalid: [
                {
                    code: "/** Some random JSDoc */",
                    options,
                    errors: [
                        {
                            messageId: "unexpectedComment",
                        },
                    ],
                },
            ],
        })
    })
})
