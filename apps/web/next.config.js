const withTM = require("next-transpile-modules")(["@voting-power/sdk"]);

module.exports = withTM({
  reactStrictMode: true,
});
