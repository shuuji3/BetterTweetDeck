const defaultLocale = require('../../_locales/en/messages.json');

// From https://github.com/lorenwest/node-config/blob/master/lib/config.js#L131-L152
const getKey = (object, property) => {
  const elems = Array.isArray(property) ? property : property.split('.');
  const name = elems[0];
  const value = object[name];

  if (elems.length <= 1) {
    return value;
  }

  if (typeof value !== 'object') {
    return undefined;
  }

  return getKey(value, elems.slice(1));
};

const storage = chrome.storage.sync || chrome.storage.local;

export const getVersion = () => chrome.app.getDetails().version;
export const getUA = () => window.navigator.userAgent;
export const getMessage = (msg) => {
  const string = chrome.i18n.getMessage(msg);

  if (string === '') {
    return defaultLocale[msg].message;
  }

  return string;
};
export const getUpgradeMessage = () => getMessage('notification_upgrade').replace('{{version}}', getVersion());

export const getURL = url => chrome.extension.getURL(url);

export const settings = {
  get(property) {
    return new Promise(resolve => {
      this.getAll().then((settingsVal) => {
        resolve(getKey(settingsVal, property));
      });
    });
  },
  set(obj) {
    return new Promise(resolve => {
      this.getAll((currSettings) => {
        storage.set({
          BTDSettings: Object.assign(currSettings, obj),
        }, resolve);
      });
    });
  },
  getAll() {
    return new Promise(resolve => {
      storage.get('BTDSettings', (obj) => {
        resolve(obj.BTDSettings);
      });
    });
  },
  setAll(newSettings, getBack = false) {
    return new Promise(resolve => {
      storage.set({
        BTDSettings: newSettings,
      }, () => {
        if (getBack) {
          return this.getAll().then(resolve);
        }

        return resolve();
      });
    });
  },
};

export const messages = {
  send(message, cb) {
    return chrome.runtime.sendMessage(message, cb);
  },
  on(cb) {
    return chrome.runtime.onMessage.addListener(cb);
  },
};
