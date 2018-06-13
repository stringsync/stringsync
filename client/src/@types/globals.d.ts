interface Window {
  ss: {
    auth: any;
    env: 'development' | 'test' | 'production';
    message: any;
    notification: any;
    sessionSync: {
      callback: any;
      user: any;
    };
    store: any;
  },
  XMLHttpRequest: XMLHttpRequest | jest.Mock
}
