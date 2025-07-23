import * as NodeTest from "node:test"
import { RuleTester } from "@typescript-eslint/rule-tester"
import rule from "."

// Map Node.js test functions to RuleTester
RuleTester.afterAll = NodeTest.after
RuleTester.describe = NodeTest.describe
RuleTester.it = NodeTest.it

const ruleTester = new RuleTester({})

describe("max-alternative-conditions rule", () => {

    // Test cases with explicit options provided by the user
    it("should enforce limits with explicit options", () => {
        ruleTester.run("explicit-options", rule, {
            valid: [
                // Valid: else if within limit
                {
                    code: `
                        if (x) {
                            doSomething()
                        } else if (y) {
                            doSomethingElse()
                        } else if (z) {
                            doAnotherThing()
                        }
                    `,
                    options: [{ maxElseIf: 2 }],
                },
                // Valid: else within limit
                {
                    code: `
                        if (x) {
                            doSomething()
                        } else {
                            doSomethingElse()
                        }
                    `,
                    options: [{ maxElse: 1 }],
                },
                // Valid: switch cases within limit
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
                // Valid: mixed conditions within limits
                {
                    code: `
                        if (a) {}
                        else if (b) {}
                        else {}
                    `,
                    options: [{ maxElse: 1, maxElseIf: 2 }],
                },
            ],

            invalid: [
                // Invalid: too many else if branches
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
                // Invalid: too many else branches
                {
                    code: `
                        if (a) {}
                        else {}
                        // This else is counted even if it's not directly nested,
                        // assuming the rule counts the presence of a single 'else'
                        // when maxElse is 0.
                    `,
                    options: [{ maxElse: 0 }],
                    errors: [{ messageId: "disallowedElse", data: { maxElse: 0 } }],
                },
                // Invalid: too many switch cases
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

    // Test cases relying on the rule's defaultOptions
    it("should apply default values when no options are provided", () => {
        ruleTester.run("default-options", rule, {
            valid: [
                // Valid: adheres to default maxElseIf (2) and maxElse (1)
                {
                    code: `
                        if (x) {}
                        else if (y) {}
                        else {}
                    `,
                    // No options provided, should use defaults
                },
                // Valid: adheres to default maxCase (5)
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
                    // No options provided, should use defaults
                },
            ],
            invalid: [
                // Invalid: Exceeds default maxElseIf (2)
                {
                    code: `
                        if (x) {}
                        else if (y) {}
                        else if (z) {}
                        else if (a) {}
                    `,
                    errors: [{ messageId: "tooManyElseIf", data: { maxElseIf: 2 } }],
                },
                // Invalid: Exceeds default maxCase (5)
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

    // Test cases for when options are set to 0 (disallowing usage)
    it("should disallow usage when max option is 0", () => {
        ruleTester.run("disallowed-options", rule, {
            valid: [
                // Valid: no else if when maxElseIf is 0
                {
                    code: "if (a) {}",
                    options: [{ maxElseIf: 0 }],
                },
                // Valid: no else when maxElse is 0
                {
                    code: "if (a) {}",
                    options: [{ maxElse: 0 }],
                },
                // Valid: no cases when maxCase is 0 (only empty switch or switch with just default)
                {
                    code: "switch (a) {}",
                    options: [{ maxCase: 0 }],
                },
                // Valid: switch with only a default case when maxCase is 0 (default is not counted)
                {
                    code: "switch (a) { default: break; }",
                    options: [{ maxCase: 0 }],
                },
            ],
            invalid: [
                // Invalid: else if disallowed
                {
                    code: "if (a) {} else if (b) {}",
                    options: [{ maxElseIf: 0 }],
                    errors: [{ messageId: "disallowedElseIf", data: { maxElseIf: 0 } }],
                },
                // Invalid: else disallowed
                {
                    code: "if (a) {} else {}",
                    options: [{ maxElse: 0 }],
                    errors: [{ messageId: "disallowedElse", data: { maxElse: 0 } }],
                },
                // Invalid: cases disallowed (even one non-default case)
                {
                    code: "switch (a) { case 1: break; }",
                    options: [{ maxCase: 0 }],
                    errors: [{ messageId: "disallowedCases", data: { maxCase: 0 } }],
                },
            ],
        })
    })
})
