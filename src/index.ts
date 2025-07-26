import { readFileSync } from "fs"
import path from "path"
import { default as maxNestedLoops } from "./rules/max-nested-loops"
import { default as maxNestedConditions } from "./rules/max-nested-conditions"
import { default as maxAlternativeConditions } from "./rules/max-alternative-conditions"
import { default as noElse } from "./rules/no-else"
import { default as patternSortImport } from "./rules/pattern-sort-import"
import { default as patternComment } from "./rules/pattern-comment"

const pkg = JSON.parse(readFileSync(path.join(__dirname, "../package.json"), "utf8"))
const plugin = {
    meta: {
        name: pkg.name,
        version: pkg.version,
    },
    rules: {
        "max-nested-loops": maxNestedLoops,
        "max-nested-conditions": maxNestedConditions,
        "max-alternative-conditions": maxAlternativeConditions,
        "no-else": noElse,
        "pattern-sort-import": patternSortImport,
        "pattern-comment": patternComment
    },
}

module.exports = plugin
