const common = require('./manifest.common.js');

module.exports = {
  name: common.name,
  short_name: 'BetterTDeck',
  default_locale: common.default_locale,
  version: common.version,
  manifest_version: 2,
  description: '__MSG_appDesc__',
  homepage_url: 'https://github.com/eramdam/BetterTweetDeck/',
  content_scripts: common.content_scripts,
  background: common.background,
  icons: common.icons,
  permissions: common.permissions,
  options_ui: common.options_ui,
  web_accessible_resources: common.web_accessible_resources,
  content_security_policy: common.content_security_policy,
};
