const common = require('./manifest.common.js');

module.exports = {
  name: common.name,
  version: common.version,
  author: 'Damien Erambert',
  content_scripts: common.content_scripts,
  content_security_policy: common.content_security_policy,
  default_locale: common.default_locale,
  description: common.description,
  options_page: common.options_page,
  permissions: common.permissions,
  background: {
    scripts: common.background.scripts,
    persistent: true,
  },
  icons: common.icons,
  web_accessible_resources: common.content_security_policy,
  minimum_edge_version: '33.14281.1000.0',
};
