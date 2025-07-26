import * as NodeTest from "node:test"
import { RuleTester } from "@typescript-eslint/rule-tester"
import rule from "."

RuleTester.afterAll = NodeTest.after
RuleTester.describe = NodeTest.describe
RuleTester.it = NodeTest.it

const ruleTester = new RuleTester()

describe("no-else rule", () => {
    test("allows simple if without else", () => {
        ruleTester.run("no-else", rule, {
            valid: [
                {
                    code: `
                    if (x > 0) {
                        doSomething()
                    }
                    `,
                },
            ],
            invalid: [],
        })
    })

    test("allows if-else-if chain", () => {
        ruleTester.run("no-else", rule, {
            valid: [
                {
                    code: `
                    if (x > 0) {
                        doSomething()
                    } else if (x < 0) {
                        doSomethingElse()
                    }
                    `,
                },
            ],
            invalid: [],
        })
    })

    test("allows early return pattern", () => {
        ruleTester.run("no-else", rule, {
            valid: [
                {
                    code: `
                    if (x > 0) {
                        return 'yes'
                    }
                    return 'no'
                    `,
                },
            ],
            invalid: [],
        })
    })

    test("disallows else block", () => {
        ruleTester.run("no-else", rule, {
            valid: [],
            invalid: [
                {
                    code: `
                    if (x > 0) {
                        doSomething()
                    } else {
                        doSomethingElse()
                    }
                    `,
                    errors: [{ messageId: "noElse" }],
                },
            ],
        })
    })

    test("disallows nested else block", () => {
        ruleTester.run("no-else", rule, {
            valid: [],
            invalid: [
                {
                    code: `
                    if (x > 0) {
                        doSomething()
                    } else {
                        if (y < 0) {
                            doSomethingElse()
                        }
                    }
                    `,
                    errors: [{ messageId: "noElse" }],
                },
            ],
        })
    })
})