import { readFileSync } from "fs"
import path from "path"
import { default as maxNestedLoops } from "./rules/max-nested-loops"
import { default as maxNestedConditions } from "./rules/max-nested-conditions"
import { default as maxAlternativeConditions } from "./rules/max-alternative-conditions"

const pkg = JSON.parse(readFileSync(path.join(__dirname, "../package.json"), "utf8"))
const plugin = {
    meta: {
        name: pkg.name,
        version: pkg.version,
    },
    rules: {
        "max-nested-loops": maxNestedLoops,
        "max-nested-conditions": maxNestedConditions,
        "max-alternative-conditions": maxAlternativeConditions
    },
}

module.exports = plugin
