export type Device = {
  primaryInput: 'mouse' | 'touch';
  inputType: 'mouseOnly' | 'touchOnly' | 'hybrid';
  apple: {
    phone: boolean;
    ipod: boolean;
    tablet: boolean;
    device: boolean;
  };
  amazon: {
    phone: boolean;
    tablet: boolean;
    device: boolean;
  };
  android: {
    phone: boolean;
    tablet: boolean;
    device: boolean;
  };
  windows: {
    phone: boolean;
    tablet: boolean;
    device: boolean;
  };
  other: {
    blackberry: boolean;
    blackberry10: boolean;
    opera: boolean;
    firefox: boolean;
    chrome: boolean;
    device: boolean;
  };
  phone: boolean;
  tablet: boolean;
  mobile: boolean;
};
