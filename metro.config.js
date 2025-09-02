// Learn more https://docs.expo.dev/guides/customizing-metro/
const { getDefaultConfig } = require('@expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// keep your customizations
config.resolver.sourceExts.push('cjs');
config.resolver.unstable_enablePackageExports = true;

// ➕ Treat .md (and .mdx if you want) as assets
const { assetExts, sourceExts } = config.resolver;
config.resolver.assetExts = [...assetExts, 'md', 'mdx'];
config.resolver.sourceExts = sourceExts.filter((e) => !['md', 'mdx'].includes(e));

module.exports = config;
