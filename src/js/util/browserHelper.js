// This module is used by the background page

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

const isEdge = typeof chrome === 'undefined';
const browserObject = isEdge ? window.browser : chrome;


const settingsKey = 'BTDSettings';
const storage = browserObject.storage.sync || browserObject.storage.local;

export const getVersion = () => browserObject.app.getDetails().version;
export const getUA = () => window.navigator.userAgent;
export const getMessage = (msg) => {
  const string = browserObject.i18n.getMessage(msg);

  if (string === '') {
    throw new Error(`No Message found for ${msg} in locales`);
  }

  return string;
};

export const getLocaleFor = (key) => browserObject.i18n.getMessage(key);
export const getURL = url => browserObject.extension.getURL(url);

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
          [settingsKey]: Object.assign(currSettings, obj),
        }, resolve);
      });
    });
  },
  getAll() {
    return new Promise(resolve => {
      storage.get(settingsKey, (obj) => {
        resolve(obj[settingsKey]);
      });
    });
  },
  setAll(newSettings, getBack = false) {
    return new Promise(resolve => {
      storage.set({
        [settingsKey]: newSettings,
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
    return browserObject.runtime.sendMessage(message, cb);
  },
  on(cb) {
    return browserObject.runtime.onMessage.addListener(cb);
  },
};
