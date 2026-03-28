// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

config.resolver.sourceExts.push('mjs');
config.resolver.resolverMainFields = ['react-native', 'browser', 'module', 'main'];

// Expo's whatwg-url-without-unicode requires Node's built-in 'punycode',
// but Metro can't resolve Node built-ins. Intercept and point to npm package.
const originalResolveRequest = config.resolver.resolveRequest;
config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (moduleName === 'punycode') {
    return {
      filePath: path.resolve(__dirname, 'node_modules/punycode/punycode.js'),
      type: 'sourceFile',
    };
  }
  if (originalResolveRequest) {
    return originalResolveRequest(context, moduleName, platform);
  }
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
