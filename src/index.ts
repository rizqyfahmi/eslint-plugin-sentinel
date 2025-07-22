import { readFileSync } from "fs"
import path from "path"

const pkg = JSON.parse(readFileSync(path.join(__dirname, "../package.json"), "utf8"))
const plugin = {
    meta: {
        name: pkg.name,
        version: pkg.version,
    },
    rules: {},
}

module.exports = plugin
