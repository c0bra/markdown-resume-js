module.exports = {
    "parserOptions": {
      "ecmaVersion": 6,
      "sourceType": "module"
    },
    "env": {
        "browser": true,
        "es6": true,
        "node": true,
        "jasmine": true
    },
    "extends": "eslint:recommended",
    "plugins": [
      "jasmine"
    ],
    "rules": {
        "indent": [
            "error",
            2
        ],
        "linebreak-style": [
            "error",
            "windows"
        ],
        "quotes": [
            "error",
            "single"
        ],
        "semi": [
            "error",
            "always"
        ]
    }
};
