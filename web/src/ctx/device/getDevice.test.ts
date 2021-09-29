import { merge } from 'lodash';
import { DeepPartial } from '../../util/types';
import { getDevice } from './getDevice';
import { Device } from './types';

describe('getDevice', () => {
  const assertDevice = (actualDevice: Device, partialDeviceExpectation: DeepPartial<Device>) => {
    const falseDevice: Device = {
      inputType: 'mouseOnly',
      primaryInput: 'mouse',
      amazon: {
        device: false,
        phone: false,
        tablet: false,
      },
      android: {
        device: false,
        phone: false,
        tablet: false,
      },
      apple: {
        device: false,
        ipod: false,
        phone: false,
        tablet: false,
      },
      windows: {
        device: false,
        phone: false,
        tablet: false,
      },
      other: {
        blackberry: false,
        blackberry10: false,
        chrome: false,
        device: false,
        firefox: false,
        opera: false,
      },
      mobile: false,
      phone: false,
      tablet: false,
    };

    const deviceExpectation = merge(falseDevice, partialDeviceExpectation);
    expect(actualDevice).toStrictEqual(deviceExpectation);
  };

  it('detects Chrome', () => {
    const userAgent =
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_7_3) AppleWebKit/535.19 (KHTML, like Gecko) Chrome/18.0.1025.151 Safari/535.19';

    const device = getDevice(userAgent);

    assertDevice(device, { mobile: false });
  });

  it('detects Safari', () => {
    const userAgent =
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_7_3) AppleWebKit/534.53.11 (KHTML, like Gecko) Version/5.1.3 Safari/534.53.10';

    const device = getDevice(userAgent);

    assertDevice(device, { mobile: false });
  });

  it('detects iPhone', () => {
    const userAgent =
      'Mozilla/5.0 (iPhone; U; CPU like Mac OS X; en) AppleWebKit/420+ (KHTML, like Gecko) Version/3.0 Mobile/1A543 Safari/419.3';

    const device = getDevice(userAgent);

    assertDevice(device, {
      apple: {
        phone: true,
        tablet: false,
        ipod: false,
        device: true,
      },
      mobile: true,
      phone: true,
    });
  });

  it('detects iPad', () => {
    const userAgent =
      'Mozilla/5.0 (iPad; U; CPU OS 3_2 like Mac OS X; en-us) AppleWebKit/531.21.10 (KHTML, like Gecko) Version/4.0.4 Mobile/7B334b Safari/531.21.10';

    const device = getDevice(userAgent);

    assertDevice(device, {
      apple: {
        phone: false,
        tablet: true,
        ipod: false,
        device: true,
      },
      mobile: true,
      tablet: true,
    });
  });

  it('detects Facebook iPhone app', () => {
    const userAgent =
      'Mozilla/5.0 (iPhone; CPU OS 8_1 like Mac OS X) AppleWebKit/600.1.4 (KHTML, like Gecko) Mobile/12B410 [FBAN/FBIOS;FBAV/20.1.0.15.10;FBBV/5758778;FBDV/iPad5,4;FBMD/iPad;FBSN/iPhone OS;FBSV/8.1;FBSS/2; FBCR/;FBID/tablet;FBLC/fi_FI;FBOP/1]';

    const device = getDevice(userAgent);

    assertDevice(device, {
      apple: {
        phone: true,
        tablet: false,
        device: true,
      },
      mobile: true,
      phone: true,
    });
  });

  it('detects Twitter iPhone app', () => {
    const userAgent =
      'Mozilla/5.0 (iPhone; CPU iPhone OS 9_2_1 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Mobile/13D15 Twitter for iPhone';

    const device = getDevice(userAgent);

    assertDevice(device, {
      apple: {
        phone: true,
        tablet: false,
        device: true,
        ipod: false,
      },
      mobile: true,
      phone: true,
    });
  });

  it('detects Twitter iPad app', () => {
    const userAgent =
      'Mozilla/5.0 (iPad; CPU OS 9_2_1 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Mobile/13D15 Twitter for iPhone';

    const device = getDevice(userAgent);

    assertDevice(device, {
      apple: {
        phone: false,
        tablet: true,
        device: true,
      },
      mobile: true,
      tablet: true,
    });
  });

  it('detects Android phone', () => {
    const userAgent =
      'Mozilla/5.0 (Linux; <Android Version>; <Build Tag etc.>) AppleWebKit/<WebKit Rev> (KHTML, like Gecko) Chrome/<Chrome Rev> Mobile Safari/<WebKit Rev>';

    const device = getDevice(userAgent);

    assertDevice(device, {
      android: {
        phone: true,
        tablet: false,
        device: true,
      },
      other: {
        chrome: false,
        device: false,
      },
      mobile: true,
      phone: true,
    });
  });

  it('detects Android tablet', () => {
    const userAgent =
      'Mozilla/5.0 (Linux; <Android Version>; <Build Tag etc.>) AppleWebKit/<WebKit Rev>(KHTML, like Gecko) Chrome/<Chrome Rev> Safari/<WebKit Rev>';

    const device = getDevice(userAgent);

    assertDevice(device, {
      android: {
        phone: false,
        tablet: true,
        device: true,
      },
      other: {
        chrome: false,
        device: false,
      },
      tablet: true,
      mobile: true,
    });
  });

  it('detects OkHttp', () => {
    const userAgent = 'okhttp/3.9.1';

    const device = getDevice(userAgent);

    assertDevice(device, {
      android: {
        phone: false,
        tablet: false,
        device: true,
      },
      tablet: false,
      mobile: true,
    });
  });

  it('detects Amazon Kindle Fire', () => {
    const userAgent =
      'Mozilla/5.0 (Linux; U; Android android-version; locale; KFOT Build/product-build) AppleWebKit/webkit-version (KHTML, like Gecko) Silk/browser-version like Chrome/chrome-version Safari/webkit-version';

    const device = getDevice(userAgent);

    assertDevice(device, {
      amazon: {
        phone: false,
        tablet: true,
        device: true,
      },
      android: {
        phone: false,
        tablet: true,
        device: true,
      },
      tablet: true,
      mobile: true,
    });
  });

  it('detects Amazon Kindle Fire HD', () => {
    const userAgent =
      'Mozilla/5.0 (Linux; U; Android android-version; locale; KFTT Build/product-build) AppleWebKit/webkit-version (KHTML, like Gecko) Silk/browser-version like Chrome/chrome-version Safari/webkit-version';

    const device = getDevice(userAgent);

    assertDevice(device, {
      amazon: {
        phone: false,
        tablet: true,
        device: true,
      },
      android: {
        tablet: true,
        device: true,
      },
      tablet: true,
      mobile: true,
    });
  });
});
