import { store } from 'data';

declare global {
  interface Window {
    ss: {
      env: string;
      store: typeof store;
    }
  }
}
