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
      maxElse: 1,
      maxCase: 5
    }],
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
  if (condition2) {  // ❌ Exceeds max depth of 1
    return 'Too Deep';
  }
}
```

```js
const result = condition1
  ? condition2     // ❌ Nested ternary
    ? 'A'
    : 'B'
  : 'C';
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

**Limits the number of `else if`, `else`, and `switch case` branches to reduce complex branching logic.**

#### ❌ Incorrect

```js
if (a) {}
else if (b) {}
else if (c) {}
else if (d) {}  // ❌ Too many else-if branches
```

```js
if (x) {}
else {}  // ❌ Too many else branches if `maxElse` is 0
```

```js
switch (value) {
  case 1: break;
  case 2: break;
  case 3: break;
  case 4: break;
  case 5: break;
  case 6: break;  // ❌ Exceeds maxCase
}
```

#### ✅ Correct

```js
if (a) {}
else if (b) {}
else {}  // ✅ Within allowed branch limits
```

```js
switch (value) {
  case 1: break;
  case 2: break;
  case 3: break;
}
```

#### Options

You can customize the limits using the following options:

* `maxElseIf` (number) – Maximum allowed `else if` branches (default: `2`)
* `maxElse` (number) – Maximum allowed `else` branches (default: `1`)
* `maxCase` (number) – Maximum allowed `switch` case clauses (default: `5`)

```js
"eslint-plugin-essential/max-alternative-conditions": ["error", {
  maxElseIf: 2,
  maxElse: 1,
  maxCase: 5
}]
```

> ℹ️ If no options are specified, the default limits apply.

---

## 🔓 License

See the [LICENSE](https://github.com/rizqyfahmi/eslint-plugin-essential/blob/master/LICENSE) file for license rights and limitations (MIT).