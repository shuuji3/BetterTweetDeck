const common = require('./manifest.common.js');

module.exports = {
  name: common.name,
  version: common.version,
  minimum_edge_version: '33.14281.1000.0',
  description: common.description,
  author: 'Damien Erambert',
  background: {
    scripts: common.background.scripts,
    persistent: true,
  },
  options_page: common.options_page,
  content_scripts: common.content_scripts,
  icons: common.icons,
  permissions: common.permissions,
  content_security_policy: common.content_security_policy,
  web_accessible_resources: common.web_accessible_resources,
  '-ms-preload': {
    backgroundScript: 'backgroundScriptsAPIBridge.js',
    contentScript: 'contentScriptsAPIBridge.js',
  },
};
