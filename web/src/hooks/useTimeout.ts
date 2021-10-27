import { useEffectOnce } from './useEffectOnce';

type Callback = () => void;

export const useTimeout = (callback: Callback, ms: number) => {
  useEffectOnce(() => {
    const handle = window.setTimeout(callback, ms);
    return () => {
      window.clearTimeout(handle);
    };
  });
};
