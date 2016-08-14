import fecha from 'fecha';
import { settings } from './browserHelper';

let timestampMode;
let customMode;
let fullAfter24;

settings.get('ts').then(response => {
  timestampMode = response;
});

settings.get('full_aft_24').then(response => {
  fullAfter24 = response;
});

settings.get('custom_ts').then(response => {
  customMode = response;
});

const formatMaps = {
  absolute_us: {
    full: 'MM/DD/YY hh:mm a',
    short: 'hh:mm a',
  },
  absolute_metric: {
    full: 'DD/MM/YY HH:mm',
    short: 'HH:mm',
  },
};

function moreThan24(d) {
  return (new Date().getTime() - d.getTime()) <= 60 * 60 * 24000;
}

function getFormat(dateObject, mode) {
  if (mode === 'custom') {
    if (fullAfter24 && moreThan24(dateObject)) {
      return customMode.short;
    }

    return customMode.full;
  }
  if (fullAfter24 && moreThan24(dateObject)) {
    return formatMaps[mode].short;
  }

  return formatMaps[mode].full;
}

function getDateObject(dateString) {
  if (Number(dateString)) {
    return new Date(Number(dateString));
  }

  return new Date(dateString);
}

function timestampOnElement(element, dateString) {
  if (timestampMode === 'relative') {
    return;
  }

  const d = getDateObject(dateString);

  element.innerHTML = fecha.format(d, getFormat(d, timestampMode));
}

module.exports = timestampOnElement;
