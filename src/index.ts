import { readFileSync } from "fs"
import path from "path"
import { default as maxNestedLoops } from "./rules/max-nested-loops"

const pkg = JSON.parse(readFileSync(path.join(__dirname, "../package.json"), "utf8"))
const plugin = {
    meta: {
        name: pkg.name,
        version: pkg.version,
    },
    rules: {
        "max-nested-loops": maxNestedLoops
    },
}

module.exports = plugin
