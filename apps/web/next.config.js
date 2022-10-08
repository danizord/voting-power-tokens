const withTM = require("next-transpile-modules")(["@danizord/voting-power-tokens-sdk"]);

module.exports = withTM({
  reactStrictMode: true,
});
