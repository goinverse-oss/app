module.exports = {
  transformer: {
    assetPlugins: ['expo-asset/tools/hashAssetFiles'],
  },
  resolver: {
    blacklistRE: /\/(ios|android)\//,
  },
};
