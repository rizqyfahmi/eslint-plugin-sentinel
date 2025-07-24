import * as NodeTest from "node:test"
import { RuleTester } from "@typescript-eslint/rule-tester"
import dedent from "dedent"
import rule from "."

RuleTester.afterAll = NodeTest.after
RuleTester.describe = NodeTest.describe
RuleTester.it = NodeTest.it

const ruleTester = new RuleTester({})

describe("pattern-sort-import rule", () => {
    test("should pass when imports are correctly sorted", () => {
        ruleTester.run("pattern-sort-import", rule, {
            valid: [
                {
                    code: dedent(`
                        import { useEffect } from "react"
                        import { TbInfoCircle } from "react-icons/tb"
                        import Link from "next/link"
                        import { observer } from "mobx-react-lite"
                        import MyComponent from "@/components/my-component"
                        import styles from "./styles.module.css"
                    `),
                    options: [[
                        "^react",
                        "^next",
                        "^mobx-react-lite$",
                        "^react-icons",
                        "^@/",
                        "^\\.",
                    ]],
                },
                {
                    code: dedent(""), // No imports
                    options: [[
                        "^react",
                        "^next",
                        "^mobx-react-lite$",
                        "^react-icons",
                        "^@/",
                        "^\\.",
                    ]],
                },
                {
                    code: dedent(`
                        import fs from "fs"
                    `), // Single import
                    options: [[
                        "^react",
                        "^next",
                        "^mobx-react-lite$",
                        "^react-icons",
                        "^@/",
                        "^\\.",
                    ]],
                },
            ],
            invalid: [],
        })
    })

    test("should fix incorrectly sorted imports", () => {
        ruleTester.run("pattern-sort-import", rule, {
            valid: [],
            invalid: [
                {
                    code: dedent(`
                        import Link from "next/link"
                        import { useEffect } from "react"
                        import { observer } from "mobx-react-lite"
                        import { TbInfoCircle } from "react-icons/tb"
                        import styles from "./styles.module.css"
                        import MyComponent from "@/components/my-component"
                    `),
                    output: dedent(`
                        import { useEffect } from "react"
                        import { TbInfoCircle } from "react-icons/tb"
                        import Link from "next/link"
                        import { observer } from "mobx-react-lite"
                        import MyComponent from "@/components/my-component"
                        import styles from "./styles.module.css"
                    `),
                    options: [[
                        "^react",
                        "^next",
                        "^mobx-react-lite$",
                        "^react-icons",
                        "^@/",
                        "^\\.",
                    ]],
                    errors: [{ messageId: "unsorted" }],
                },
                {
                    code: dedent(`
                        import "unmatched-module"
                        import { useEffect } from "react"
                    `),
                    output: dedent(`
                        import { useEffect } from "react"
                        import "unmatched-module"
                    `),
                    options: [[
                        "^react",
                    ]],
                    errors: [{ messageId: "unsorted" }],
                }
            ],
        })
    })
})
