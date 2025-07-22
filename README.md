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

```sh
npm install eslint-plugin-essential --save-dev
```

---

## 🚀 Usage

In your ESLint configuration file (e.g., `.eslintrc.js`), import and configure the plugin:

```js
import essential from "eslint-plugin-essential";

module.exports = {
  plugins: {
    "eslint-plugin-essential": essential,
  },
  rules: {
    "eslint-plugin-essential/max-nested-loops": ["error", { "maxDepth": 1 }],
    // Add other rules here as they are implemented
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

* `maxDepth` (number) – The maximum allowed nesting level (default: `1`).

```js
"eslint-plugin-essential/max-nested-loops": ["error", { "maxDepth": 1 }]
```

### 2. `max-nested-conditionals`

**Limits the depth of nested conditional statements like `if`, `switch`, and ternary (`?:`) expressions.**

Default maximum depth: **1**

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

#### ✅ Correct (Depth ≤ 1)

```js
if (condition1) {
  return 'Shallow enough';
}
```

```js
const result = condition1 ? 'A' : 'B';
```

> ✅ These examples have **only one conditional structure** at the top level — no nesting inside another conditional.

#### Options

* `maxDepth` (number) – The maximum allowed nesting level of conditionals (default: `1`).

```js
"eslint-plugin-essential/max-nested-conditionals": ["error", { "maxDepth": 1 }]
```

---

## 🧩 Adding More Rules

As this plugin evolves, more rules will be added to help you enforce best practices across your codebase. Stay tuned!

---

## 📣 Contributing

Want to suggest a new rule or improve an existing one? Feel free to open an issue or pull request!

---

## 📄 License

MIT © Ahmad Yulia Rizqy Fahmi

---

Let me know if you’d like help creating documentation for specific rules or setting up rule testing.
