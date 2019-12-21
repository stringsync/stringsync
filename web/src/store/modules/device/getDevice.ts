import { Device } from './types';
import { getUserAgent } from './getUserAgent';

const appleIphone = /iPhone/i;
const appleIpod = /iPod/i;
const appleTablet = /iPad/i;
const androidPhone = /\bAndroid(?:.+)Mobile\b/i; // Match 'Android' AND 'Mobile'
const androidTablet = /Android/i;
const amazonPhone = /(?:SD4930UR|\bSilk(?:.+)Mobile\b)/i; // Match 'Silk' AND 'Mobile'
const amazonTablet = /Silk/i;
const windowsPhone = /Windows Phone/i;
const windowsTablet = /\bWindows(?:.+)ARM\b/i; // Match 'Windows' AND 'ARM'
const otherBlackBerry = /BlackBerry/i;
const otherBlackBerry10 = /BB10/i;
const otherOpera = /Opera Mini/i;
const otherChrome = /\b(CriOS|Chrome)(?:.+)Mobile/i;
const otherFirefox = /Mobile(?:.+)Firefox\b/i; // Match 'Mobile' AND 'Firefox'

const match = (regex: RegExp, userAgent: string): boolean => {
  return regex.test(userAgent);
};

export const getDevice = (userAgent?: string): Device => {
  /* eslint-disable no-param-reassign */
  userAgent = userAgent || getUserAgent();

  // Facebook mobile app's integrated browser adds a bunch of strings that
  // match everything. Strip it out if it exists.
  let tmp = userAgent.split('[FBAN');
  if (typeof tmp[1] !== 'undefined') {
    userAgent = tmp[0];
  }

  // Twitter mobile app's integrated browser on iPad adds a "Twitter for
  // iPhone" string. Same probably happens on other tablet platforms.
  // This will confuse detection so strip it out if it exists.
  tmp = userAgent.split('Twitter');
  if (typeof tmp[1] !== 'undefined') {
    userAgent = tmp[0];
  }

  const device: Device = {
    apple: {
      phone: match(appleIphone, userAgent) && !match(windowsPhone, userAgent),
      ipod: match(appleIpod, userAgent),
      tablet:
        !match(appleIphone, userAgent) &&
        match(appleTablet, userAgent) &&
        !match(windowsPhone, userAgent),
      device:
        (match(appleIphone, userAgent) ||
          match(appleIpod, userAgent) ||
          match(appleTablet, userAgent)) &&
        !match(windowsPhone, userAgent),
    },
    amazon: {
      phone: match(amazonPhone, userAgent),
      tablet: !match(amazonPhone, userAgent) && match(amazonTablet, userAgent),
      device: match(amazonPhone, userAgent) || match(amazonTablet, userAgent),
    },
    android: {
      phone:
        (!match(windowsPhone, userAgent) && match(amazonPhone, userAgent)) ||
        (!match(windowsPhone, userAgent) && match(androidPhone, userAgent)),
      tablet:
        !match(windowsPhone, userAgent) &&
        !match(amazonPhone, userAgent) &&
        !match(androidPhone, userAgent) &&
        (match(amazonTablet, userAgent) || match(androidTablet, userAgent)),
      device:
        (!match(windowsPhone, userAgent) &&
          (match(amazonPhone, userAgent) ||
            match(amazonTablet, userAgent) ||
            match(androidPhone, userAgent) ||
            match(androidTablet, userAgent))) ||
        match(/\bokhttp\b/i, userAgent),
    },
    windows: {
      phone: match(windowsPhone, userAgent),
      tablet: match(windowsTablet, userAgent),
      device: match(windowsPhone, userAgent) || match(windowsTablet, userAgent),
    },
    other: {
      blackberry: match(otherBlackBerry, userAgent),
      blackberry10: match(otherBlackBerry10, userAgent),
      opera: match(otherOpera, userAgent),
      firefox: match(otherFirefox, userAgent),
      chrome: match(otherChrome, userAgent),
      device:
        match(otherBlackBerry, userAgent) ||
        match(otherBlackBerry10, userAgent) ||
        match(otherOpera, userAgent) ||
        match(otherFirefox, userAgent) ||
        match(otherChrome, userAgent),
    },
    any: false,
    phone: false,
    tablet: false,
  };

  device.any =
    device.apple.device ||
    device.android.device ||
    device.windows.device ||
    device.other.device;
  // excludes 'other' devices and ipods, targeting touchscreen phones
  device.phone =
    device.apple.phone || device.android.phone || device.windows.phone;
  device.tablet =
    device.apple.tablet || device.android.tablet || device.windows.tablet;

  return device;
};
