const { override, addLessLoader } = require("customize-cra");

module.exports = override(
    addLessLoader({
        javascriptEnabled: true,
        modifyVars: { "@grid-gutter-width": "30px" }
    })
);
