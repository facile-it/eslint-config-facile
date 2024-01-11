const { join } = require("path");
module.exports = {
    extends: ['../dist/index.js'],
    parserOptions: {
        project: join(__dirname, "./tsconfig.json"),
    },
}
