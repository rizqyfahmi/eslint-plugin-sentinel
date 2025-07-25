import * as NodeTest from "node:test"
import { RuleTester } from "@typescript-eslint/rule-tester"
import rule from "."

RuleTester.afterAll = NodeTest.after
RuleTester.describe = NodeTest.describe
RuleTester.it = NodeTest.it

const ruleTester = new RuleTester()

describe("max-alternative-conditionals rule", () => {
    test("should enforce limits with explicit options", () => {
        ruleTester.run("explicit-options", rule, {
            valid: [
                {
                    code: `
                        if (x) {
                        } else if (y) {
                        } else if (z) {
                        }
                    `,
                    options: [{ maxElseIf: 2 }],
                },
                {
                    code: `
                        switch (value) {
                            case 1: break;
                            case 2: break;
                            case 3: break;
                        }
                    `,
                    options: [{ maxCase: 5 }],
                },
            ],
            invalid: [
                {
                    code: `
                        if (a) {}
                        else if (b) {}
                        else if (c) {}
                        else if (d) {}
                    `,
                    options: [{ maxElseIf: 2 }],
                    errors: [{ messageId: "tooManyElseIf", data: { maxElseIf: 2 } }],
                },
                {
                    code: `
                        switch (value) {
                            case 1: break;
                            case 2: break;
                            case 3: break;
                            case 4: break;
                            case 5: break;
                            case 6: break;
                        }
                    `,
                    options: [{ maxCase: 5 }],
                    errors: [{ messageId: "tooManyCases", data: { maxCase: 5 } }],
                },
            ],
        })
    })

    test("should apply default values when no options are provided", () => {
        ruleTester.run("default-options", rule, {
            valid: [
                {
                    code: `
                        if (x) {}
                        else if (y) {}
                    `,
                },
                {
                    code: `
                        switch (foo) {
                            case 1: break;
                            case 2: break;
                            case 3: break;
                            case 4: break;
                            case 5: break;
                        }
                    `,
                },
            ],
            invalid: [
                {
                    code: `
                        if (x) {}
                        else if (y) {}
                        else if (z) {}
                        else if (a) {}
                    `,
                    errors: [{ messageId: "tooManyElseIf", data: { maxElseIf: 2 } }],
                },
                {
                    code: `
                        switch (value) {
                            case 1: break;
                            case 2: break;
                            case 3: break;
                            case 4: break;
                            case 5: break;
                            case 6: break;
                        }
                    `,
                    errors: [{ messageId: "tooManyCases", data: { maxCase: 5 } }],
                },
            ],
        })
    })

    // Test cases where usage is fully disallowed (0)
    test("should disallow usage when maxElseIf or maxCase is 0", () => {
        ruleTester.run("disallowed-options", rule, {
            valid: [
                {
                    code: "if (a) {}",
                    options: [{ maxElseIf: 0 }],
                },
                {
                    code: "switch (a) {}",
                    options: [{ maxCase: 0 }],
                },
                {
                    code: "switch (a) { default: break; }",
                    options: [{ maxCase: 0 }],
                },
            ],
            invalid: [
                {
                    code: "if (a) {} else if (b) {}",
                    options: [{ maxElseIf: 0 }],
                    errors: [{ messageId: "disallowedElseIf", data: { maxElseIf: 0 } }],
                },
                {
                    code: "switch (a) { case 1: break; }",
                    options: [{ maxCase: 0 }],
                    errors: [{ messageId: "disallowedCases", data: { maxCase: 0 } }],
                },
            ],
        })
    })
})
