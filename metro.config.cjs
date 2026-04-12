// Metro configuration (CommonJS) to avoid "Property 'require' doesn't exist" runtime errors.
// Keep this file as .cjs and export with module.exports so it's treated as CommonJS even if
// package.json contains "type": "module".

module.exports = {
  transformer: {
    getTransformOptions: async () => ({
      transform: {
        // disable inlineRequires to avoid require being invoked before runtime polyfills are ready
        experimentalImportSupport: false,
        inlineRequires: false,
      },
    }),
  },
};
