// https://docs.expo.dev/guides/using-eslint/
module.exports = {
  env: {
    node: true,
    jest: true,
  },
  extends: ["expo", "prettier", "eslint:recommended"],
  plugins: ["prettier"],
  rules: {
    "no-console": "error",
    "@typescript-eslint/no-explicit-any": "error",
    "prettier/prettier": ["error", { endOfLine: "auto" }],
    "import/no-unresolved": "error",
  },
};
