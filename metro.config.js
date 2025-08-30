// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('@expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

config.resolver.sourceExts.push('cjs');
// Enable package.json "exports" to resolve Firebase subpath correctly
config.resolver.unstable_enablePackageExports = true;

module.exports = config;
