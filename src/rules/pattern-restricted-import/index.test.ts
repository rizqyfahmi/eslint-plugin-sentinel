import * as NodeTest from "node:test"
import { RuleTester } from "@typescript-eslint/rule-tester"
import rule from "."

RuleTester.afterAll = NodeTest.after
RuleTester.describe = NodeTest.describe
RuleTester.it = NodeTest.it

const options: [string[]] = [
    ["^@internal/.*", "^\\.\\./utils/.*"],
]


const ruleTester = new RuleTester({})

describe("pattern-restricted-import", () => {
    it("should allow unrelated imports", () => {
        ruleTester.run("pattern-restricted-import", rule, {
            valid: [
                {
                    code: "import fs from 'fs'",
                    options: options,
                },
                {
                    code: "import something from './local/module'",
                    options: options,
                },
            ],
            invalid: [],
        })
    })

    it("should disallow @internal imports", () => {
        ruleTester.run("pattern-restricted-import", rule, {
            valid: [],
            invalid: [
                {
                    code: "import utils from '@internal/utils'",
                    options: options,
                    errors: [
                        {
                            messageId: "restrictedImport",
                            data: {
                                importPath: "@internal/utils",
                                pattern: "/^@internal/.*/",
                            },
                        },
                    ],
                },
            ],
        })
    })

    it("should disallow relative utils imports", () => {
        ruleTester.run("pattern-restricted-import", rule, {
            valid: [],
            invalid: [
                {
                    code: "import helper from '../utils/helper'",
                    options: options,
                    errors: [
                        {
                            messageId: "restrictedImport",
                            data: {
                                importPath: "../utils/helper",
                                pattern: "/^\\.\\./utils/.*/",
                            },
                        },
                    ],
                },
            ],
        })
    })

    it("should allow import when no pattern matches", () => {
        ruleTester.run("pattern-restricted-import", rule, {
            valid: [
                {
                    code: "import path from 'path'",
                    options: options,
                },
            ],
            invalid: [],
        })
    })

    it("should allow import if patterns array is empty", () => {
        ruleTester.run("pattern-restricted-import", rule, {
            valid: [
                {
                    code: "import path from '@internal/test'",
                    options: [[]],
                },
            ],
            invalid: [],
        })
    })

    // ✅ NEW TEST CASE - no options provided
    it("should allow import when no options are provided (cover fallback path)", () => {
        ruleTester.run("pattern-restricted-import", rule, {
            valid: [
                {
                    code: "import anything from '@internal/test'",
                    // ❌ no options key
                },
            ],
            invalid: [],
        })
    })
})
