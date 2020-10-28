const { join } = require("path");
module.exports = {
    extends: ['../index.js'],
    parserOptions: {
        project: join(__dirname, "./tsconfig.json"),
    },
}
