const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const config = getDefaultConfig(__dirname);

// Explicitly add otf to assetExts
config.resolver.assetExts.push("otf");
config.resolver.assetExts.push("ttf");

// Enable package exports for Apollo Client and other modern packages
config.resolver.unstable_enablePackageExports = true;

module.exports = withNativeWind(config, { input: "./styles/global.css" });

