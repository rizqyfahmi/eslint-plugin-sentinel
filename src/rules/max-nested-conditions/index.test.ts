import * as NodeTest from "node:test"
import { RuleTester } from "@typescript-eslint/rule-tester"
import rule from "."

RuleTester.afterAll = NodeTest.after
RuleTester.describe = NodeTest.describe
RuleTester.it = NodeTest.it

const ruleTester = new RuleTester({})

describe("max-nested-conditionals rule", () => {
    test("should allow not a conditional node", () => {
        ruleTester.run("max-nested-conditionals", rule, {
            valid: [
                {
                    code: `
                        const x = 10; // not a conditional node
                    `,
                }
            ],
            invalid: [],
        })
    })

    test("should allow nesting within default depth (1)", () => {
        ruleTester.run("max-nested-conditionals", rule, {
            valid: [
                {
                    code: `
                        if (a) {
                            doSomething()
                        }
                    `,
                },
                {
                    code: `
                        const result = a ? b : c;
                    `,
                },
                {
                    code: `
                        switch (x) {
                            case 1:
                                doSomething();
                                break;
                        }
                    `,
                },
            ],
            invalid: [],
        })
    })

    test("should allow nesting up to custom depth (2)", () => {
        ruleTester.run("max-nested-conditionals", rule, {
            valid: [
                {
                    code: `
                        if (a) {
                            if (b) {
                                doSomething()
                            }
                        }
                    `,
                    options: [{ maxDepth: 2 }],
                },
                {
                    code: `
                        if (a) {
                            const result = b ? c : d;
                        }
                    `,
                    options: [{ maxDepth: 2 }],
                },
                {
                    code: `
                        if (a) {
                            switch (b) {
                                case 1:
                                    doSomething()
                                    break;
                            }
                        }
                    `,
                    options: [{ maxDepth: 2 }],
                },
            ],
            invalid: [],
        })
    })

    test("should report too deep if statements", () => {
        ruleTester.run("max-nested-conditionals", rule, {
            valid: [],
            invalid: [
                {
                    code: `
                        if (a) {
                            if (b) {
                                if (c) {
                                    doSomething();
                                }
                            }
                        }
                    `,
                    errors: [
                        {
                            messageId: "tooDeep",
                            line: 3,
                            data: { maxDepth: 1 },
                        },
                        {
                            messageId: "tooDeep",
                            line: 4,
                            data: { maxDepth: 1 },
                        },
                    ],
                },
            ],
        })
    })

    test("should report too deep ternary expressions", () => {
        ruleTester.run("max-nested-conditionals", rule, {
            valid: [],
            invalid: [
                {
                    code: `
                        if (a) {
                            const result = b ? (c ? d : e) : f;
                        }
                    `,
                    errors: [
                        {
                            messageId: "tooDeep",
                            line: 3,
                            data: { maxDepth: 1 },
                        },
                        {
                            messageId: "tooDeep",
                            line: 3,
                            data: { maxDepth: 1 },
                        },
                    ],
                },
            ],
        })
    })

    test("should report too deep switch inside if inside switch", () => {
        ruleTester.run("max-nested-conditionals", rule, {
            valid: [],
            invalid: [
                {
                    code: `
                        switch (a) {
                            case 1:
                                if (b) {
                                    switch (c) {
                                        case 2:
                                            doSomething()
                                            break;
                                    }
                                }
                                break;
                        }
                    `,
                    options: [{ maxDepth: 2 }],
                    errors: [
                        {
                            messageId: "tooDeep",
                            line: 5,
                            data: { maxDepth: 2 },
                        },
                    ],
                },
            ],
        })
    })

    test("should allow else-if chains as same depth", () => {
        ruleTester.run("max-nested-conditionals", rule, {
            valid: [
                {
                    code: `
                        if (a) {
                            doSomething();
                        } else if (b) {
                            doSomethingElse();
                        } else if (c) {
                            anotherThing();
                        } else {
                            fallback();
                        }
                    `,
                }
            ],
            invalid: [],
        })
    })
})