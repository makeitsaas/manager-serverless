module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: ["plugin:vue/essential", "@vue/prettier"],
  rules: {
    "no-console": "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "error" : "off"
    // "vue/script-indent": ["error", 2, { "baseIndent": 1 }]
  },
  parserOptions: {
    parser: "babel-eslint"
  }
};
