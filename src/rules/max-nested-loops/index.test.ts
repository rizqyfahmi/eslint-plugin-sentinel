import * as NodeTest from "node:test"
import { RuleTester } from "@typescript-eslint/rule-tester"
import rule from "."

RuleTester.afterAll = NodeTest.after
RuleTester.describe = NodeTest.describe
RuleTester.it = NodeTest.it

const ruleTester = new RuleTester({})

describe("max-nested-loops", () => {
    test("should allow one level of loop nesting (default maxDepth: 1)", () => {
        ruleTester.run("max-nested-loops", rule, {
            valid: [
                {
                    code: `
                        for (let i = 0; i < 10; i++) {
                            console.log(i)
                        }
                    `,
                    options: [{ maxDepth: 1 }],
                },
            ],
            invalid: [],
        })
    })

    test("should allow two levels of nesting when maxDepth is 2", () => {
        ruleTester.run("max-nested-loops", rule, {
            valid: [
                {
                    code: `
                        for (let i = 0; i < 10; i++) {
                            while (true) {
                                console.log(i)
                            }
                        }
                    `,
                    options: [{ maxDepth: 2 }],
                },
            ],
            invalid: [],
        })
    })

    test("should report too deep nesting (do-while inside while inside for)", () => {
        ruleTester.run("max-nested-loops", rule, {
            valid: [],
            invalid: [
                {
                    code: `
                        for (let i = 0; i < 10; i++) {
                            while (true) {
                                do {
                                    console.log(i)
                                } while(false)
                            }
                        }
                    `,
                    options: [{ maxDepth: 2 }],
                    errors: [
                        {
                            messageId: "tooDeep",
                            line: 4,
                            data: { maxDepth: 2 },
                        },
                    ],
                },
            ],
        })
    })

    test("should report too deep nesting with three levels (while > for > for)", () => {
        ruleTester.run("max-nested-loops", rule, {
            valid: [],
            invalid: [
                {
                    code: `
                        while (true) {
                            for (let i = 0; i < 10; i++) {
                                for (let j = 0; j < 10; j++) {
                                    console.log(j)
                                }
                            }
                        }
                    `,
                    options: [{ maxDepth: 2 }],
                    errors: [
                        {
                            messageId: "tooDeep",
                            line: 4,
                            data: { maxDepth: 2 },
                        },
                    ],
                },
            ],
        })
    })

    test("should use default maxDepth (1) and report second-level nesting", () => {
        ruleTester.run("max-nested-loops", rule, {
            valid: [],
            invalid: [
                {
                    code: `
                        for (let i = 0; i < 10; i++) {
                            for (let j = 0; j < 10; j++) {
                                doSomething()
                            }
                        }
                    `,
                    options: [{}],
                    errors: [
                        {
                            messageId: "tooDeep",
                            data: { maxDepth: 1 },
                        },
                    ],
                },
            ],
        })
    })
})

