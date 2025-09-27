# eslint-plugin-essential

**A custom ESLint plugin to enforce project-specific code quality and consistency rules.**

[![npm version](https://img.shields.io/npm/v/eslint-plugin-essential.svg)](https://npmjs.com/package/eslint-plugin-essential)
[![npm downloads](https://img.shields.io/npm/dt/eslint-plugin-essential.svg)](https://npmjs.com/package/eslint-plugin-essential)
[![License](https://img.shields.io/github/license/rizqyfahmi/eslint-plugin-essential.svg)](https://github.com/rizqyfahmi/eslint-plugin-essential/blob/master/LICENSE)
[![codecov](https://codecov.io/gh/rizqyfahmi/eslint-plugin-essential/branch/master/graph/badge.svg)](https://codecov.io/gh/rizqyfahmi/eslint-plugin-essential)
[![CI](https://github.com/rizqyfahmi/eslint-plugin-essential/actions/workflows/ci.yaml/badge.svg)](https://github.com/rizqyfahmi/eslint-plugin-essential/actions/workflows/ci.yaml)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)

## 📦 Installation

Install the plugin as a development dependency:

```bash
npm install eslint-plugin-essential --save-dev
````

---

## 🚀 Usage

In your ESLint configuration file (e.g., `.eslintrc.js`), import and configure the plugin:

```js
import essential from "eslint-plugin-essential";

export default {
  plugins: {
    "eslint-plugin-essential": essential,
  },
  rules: {
    "eslint-plugin-essential/max-nested-loops": ["error", { maxDepth: 1 }],
    "eslint-plugin-essential/max-nested-conditionals": ["error", { maxDepth: 1 }],
    "eslint-plugin-essential/max-alternative-conditions": ["error", {
      maxElseIf: 2,
      maxCase: 5
    }],
    "eslint-plugin-essential/no-else": "error",
    "eslint-plugin-essential/pattern-sort-import": ["error", [
      "^react",
      "^next",
      "^mobx-react-lite$",
      "^@/",
      "^\\.",
    ]],
    "eslint-plugin-essential/pattern-comments": ["error"]
  },
};
```

> ℹ️ All rules are namespaced under `eslint-plugin-essential`.

---

## 🛠️ Available Rules

### 1. `max-nested-loops`

**Limits the depth of nested loops in your code.**

#### ❌ Incorrect

```js
for (let i = 0; i < 10; i++) {
  while (true) {  // ❌ Too deeply nested
    // ...
  }
}
```

#### ✅ Correct

```js
for (let i = 0; i < 10; i++) {
  // ...
}
```

#### Options

* `maxDepth` (number) – The maximum allowed nesting level (default: `1`)

```js
"eslint-plugin-essential/max-nested-loops": ["error", { maxDepth: 1 }]
```

---

### 2. `max-nested-conditionals`

**Limits the depth of nested conditional statements like `if`, `switch`, and ternary (`?:`) expressions.**

#### ❌ Incorrect

```js
if (condition1) {
  if (condition2) {
    return 'Too Deep';
  }
}
```

```js
const result = condition1 ? (condition2 ? 'A' : 'B') : 'C';
```

#### ✅ Correct

```js
if (condition1) {
  return 'Shallow enough';
}
```

```js
const result = condition1 ? 'A' : 'B';
```

#### Options

* `maxDepth` (number) – The maximum allowed nesting level (default: `1`)

```js
"eslint-plugin-essential/max-nested-conditionals": ["error", { maxDepth: 1 }]
```

---

### 3. `max-alternative-conditions`

**Limits the number of `else if` and `switch case` branches to reduce complex branching logic.**

#### ❌ Incorrect

```js
if (a) {}
else if (b) {}
else if (c) {}
else if (d) {}
```

```js
switch (value) {
  case 1: break;
  case 2: break;
  case 3: break;
  case 4: break;
  case 5: break;
  case 6: break;
}
```

#### ✅ Correct

```js
if (a) {}
else if (b) {}
```

```js
switch (value) {
  case 1: break;
  case 2: break;
  case 3: break;
}
```

#### Options

* `maxElseIf` (number) – Maximum allowed `else if` branches (default: `2`)
* `maxCase` (number) – Maximum allowed `switch` case clauses (default: `5`)

```js
"eslint-plugin-essential/max-alternative-conditions": ["error", {
  maxElseIf: 2,
  maxCase: 5
}]
```

> ℹ️ `else` blocks are **no longer counted or restricted** by this rule.
> Use `eslint-plugin-essential/no-else` to explicitly disallow `else`.

---

### 4. `no-else`

**Disallows the use of `else` blocks.**
Encourages early returns and guard clauses for simpler, flatter code structure. `else if` is still allowed.

#### ❌ Incorrect

```js
if (condition) {
  return true;
} else {
  return false;
}
```

#### ✅ Correct

```js
if (condition) {
  return true;
}
return false;
```

#### Options

This rule takes **no options**.

```js
"eslint-plugin-essential/no-else": "error"
```

---

### 5. `pattern-sort-import`

**Sorts import statements according to configured regex patterns without reordering imports within the same group.**

This rule enforces a custom order of import groups defined by regex patterns. Imports matching earlier patterns appear first, while imports within the same group keep their original order.

#### ❌ Incorrect

```ts
import Link from "next/link"
import { useEffect } from "react"
import { observer } from "mobx-react-lite"
import { TbInfoCircle } from "react-icons/tb"
import styles from "./styles.module.css"
import MyComponent from "@/components/my-component"
```

#### ✅ Correct

```ts
import { useEffect } from "react"
import { TbInfoCircle } from "react-icons/tb"
import Link from "next/link"
import { observer } from "mobx-react-lite"
import MyComponent from "@/components/my-component"
import styles from "./styles.module.css"
```

#### Options

An array of regex strings defining the import group order. Imports are grouped by matching these patterns.

Example:

```js
"eslint-plugin-essential/pattern-sort-import": ["error", [
  "^react",
  "^next",
  "^mobx-react-lite$",
  "^@/",
  "^\\.",
]]
```

---

### 6. `pattern-comments`

**Disallows all comments that do not match a specific pattern (regex).**
Use this rule to enforce a consistent format for all comments (e.g., requiring tags like `TODO:`, `@public`, etc.).

#### ❌ Incorrect

```js
// this is a random comment

/* just a block comment */

/** some unstructured JSDoc */
```

#### ✅ Correct

```js
// TODO: handle edge case

/** @deprecated Use another function */

/* @public This is a public method */
```

#### Options

You can customize which comment formats are allowed using a regular expression string.

```js
"eslint-plugin-essential/pattern-comments": ["error", {
  allowPattern: "^((TODO|FIXME|NOTE|BUG|HACK|OPTIMIZE|REVIEW|SECURITY):|@(public|private|deprecated))"
}]
```

* The example above allows only comments that start with:

  * `TODO:`, `FIXME:`, `NOTE:`, `BUG:`, `HACK:`, `OPTIMIZE:`, `REVIEW:`, `SECURITY:`
  * Or tags like `@public`, `@private`, `@deprecated`

> 💡 By default, the rule uses the same pattern shown above. If no `allowPattern` is provided, this default is enforced.

---


### 7. `pattern-restricted-import`

**Disallows import paths that match specific regular expression patterns.**
Use this rule to **restrict imports** from specific directories or files—such as test helpers, internal modules, or implementation details that should remain private.

#### ❌ Incorrect

```js
import helper from '../test/helper'        // 🚫 Matches /test/
import internal from '@/internal/api'      // 🚫 Matches ^@/internal/
import testUtil from './foo/bar.test.ts'   // 🚫 Matches \.test$
```

#### ✅ Correct

```js
import api from '@/public/api'
import { Button } from '@/components/ui'
```

#### Options

Provide an array of regular expression strings to define restricted import paths.

```js
"eslint-plugin-essential/pattern-restricted-import": ["error", [
  "/test/",
  "^@/internal/",
  "\\.test$"
]]
```

> ℹ️ This rule helps enforce **boundary protection** in your codebase by preventing unintended dependencies on test files or internal modules.

---

## 🔓 License

See the [LICENSE](https://github.com/rizqyfahmi/eslint-plugin-essential/blob/master/LICENSE) file for license rights and limitations (MIT).