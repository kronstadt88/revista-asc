const { getDefaultConfig } = require("metro-config");
const blacklist = require('metro-config/src/defaults/exclusionList');

module.exports = (async () => {
  const {
    resolver: { sourceExts }
  } = await getDefaultConfig(__dirname);
  return {
    resolver: {
      
      blacklistRE: blacklist([/amplify\/#current-cloud-backend\/.*/]),
      sourceExts: [...sourceExts, "cjs", "mjs"]
    }
  };
})();

