export const localStorageMock = (() => {
  let store = {};

  return {
    clear: () => {
      store = {};
    },
    getItem: (key: string) => {
      return store[key] || null;
    },
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    }
  };
})();
