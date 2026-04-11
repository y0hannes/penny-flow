import 'react-native-get-random-values';

// DO NOT import 'react-native-url-polyfill/auto' — it crashes on mobile
// because its internal whatwg-url depends on Node's punycode built-in
// which Metro cannot resolve. RN 0.76+ Hermes has native URL support.

const { decode, encode } = require('base-64');
const TextEncoding = require('text-encoding');

if (typeof global.atob === 'undefined') {
  global.atob = decode;
}

if (typeof global.btoa === 'undefined') {
  global.btoa = encode;
}

if (typeof global.TextEncoder === 'undefined') {
  (global as any).TextEncoder = TextEncoding.TextEncoder;
}

if (typeof global.TextDecoder === 'undefined') {
  (global as any).TextDecoder = TextEncoding.TextDecoder;
}

if (
  typeof global.TextDecoder === 'undefined' ||
  typeof global.TextEncoder === 'undefined' ||
  typeof global.atob === 'undefined'
) {
  console.error('[index.ts] Critical Polyfills Missing!');
}

const { registerRootComponent } = require('expo');
const App = require('./App').default;

registerRootComponent(App);