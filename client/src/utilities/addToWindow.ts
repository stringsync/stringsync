/**
 * Safely adds a global variable to the window, nested under 'window.ss'
 * 
 * @param key Namespace to nest the value under
 * @param value Object to be put on the window
 */
const addToWindow = <T extends keyof Window['ss']>(key: keyof Window['ss'], value: Window['ss'][T] ): void => {
  window.ss = window.ss || {};
  window.ss[key] = value;
};

export default addToWindow;
