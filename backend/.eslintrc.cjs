module.exports = {
    env: {
        browser: true,
        es2021: true
    },
    extends: [
        "eslint:recommended",
        "airbnb",
        "prettier",
        "eslint-config-prettier"
    ],
    overrides: [
        {
            env: {
                node: true
            },
            files: [".eslintrc.{js,cjs}"],
            parserOptions: {
                sourceType: "script"
            }
        }
    ],
    parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module"
    },
    plugins: [],
    rules: {
        "react/prop-types": "off",
        "import/prefer-default-export": "off",
        "import/extensions": "off",
        "no-console": "off"
    }
};
