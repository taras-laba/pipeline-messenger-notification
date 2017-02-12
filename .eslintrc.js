module.exports = {
    "extends": "hapi",
    "plugins": [
        "standard",
        "promise"
    ],
    "rules": {
        "hapi/hapi-capitalize-modules": "off",
        "hapi/hapi-scope-start": "off",
        "arrow-parens": ["error", "as-needed"],
        "brace-style": ["error", "1tbs"]
    }
};