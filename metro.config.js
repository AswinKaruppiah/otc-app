const { getDefaultConfig } = require("expo/metro-config");
const { withUniwindConfig } = require("uniwind/metro");

const config = getDefaultConfig(__dirname);

// Explicitly add otf to assetExts
config.resolver.assetExts.push("otf");
config.resolver.assetExts.push("ttf");

// Enable package exports for Apollo Client and other modern packages
config.resolver.unstable_enablePackageExports = true;

module.exports = withUniwindConfig(config, { cssEntryFile: "./styles/global.css" });


