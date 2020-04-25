module.exports = {
  env: {
    browser: true,
    es6: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/eslint-recommended",
    //"plugin:@typescript-eslint/recommended-requiring-type-checking",
    "plugin:import/errors",
    "plugin:import/warnings",
    "plugin:import/typescript",
    "plugin:react/recommended",
    "airbnb",
    "prettier",
    "prettier/@typescript-eslint",
    "prettier/react",
    "prettier/standard",
  ],
  globals: {
    Atomics: "readonly",
    SharedArrayBuffer: "readonly",
  },
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2018,
    sourceType: "module",
  },
  plugins: ["react", "@typescript-eslint", "react-hooks", "jsx-a11y"],
  rules: {
    quotes: ["error", "double"],
    "import/extensions": [
      "error",
      "ignorePackages",
      {
        ts: "never",
        tsx: "never",
      },
    ],
    "react/jsx-filename-extension": [2, { extensions: [".ts", ".tsx"] }],
    "linebreak-style": ["error", "windows"],
    "import/prefer-default-export": "off",
    "prefer-default-export": "off",
    "react/prop-types": "off",
    "@typescript-eslint/no-inferrable-types": "off",
    "@typescript-eslint/type-annotation-spacing": ["error", { after: true }],
    "no-plusplus": "off",
    "prefer-destructuring": "off",
    "jsx-a11y/accessible-emoji": "off",
    "no-param-reassign": "off", // immer relies on this :)
    "react-hooks/exhaustive-deps": "error",
  },
  settings: {
    "import/extensions": [".ts", ".tsx"],
    "import/parsers": {
      "@typescript-eslint/parser": [".ts", ".tsx"],
    },
    "import/resolver": {
      node: {
        extensions: [".ts", ".tsx"],
        paths: ["src"],
      },
    },
  },
};
