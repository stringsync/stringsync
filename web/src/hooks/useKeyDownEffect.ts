import { useEffect } from 'react';
import { useMemoCmp } from './useMemoCmp';

// extend as needed
export enum KeyboardKey {
  Space,
}

type Callback = () => void;

const getActiveElementTagName = () => document.activeElement?.tagName || '';

const isDown = (keyboardKey: KeyboardKey, event: KeyboardEvent): boolean => {
  switch (keyboardKey) {
    case KeyboardKey.Space:
      return event.key === ' ';
  }
};

const INPUT_ELEMENTS = ['INPUT'];

export const useKeyDownEffect = (keyboardKeys: KeyboardKey[], callback: Callback) => {
  keyboardKeys = useMemoCmp(keyboardKeys);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (getActiveElementTagName() in INPUT_ELEMENTS) {
        return;
      }
      const allKeyboardKeysDown = keyboardKeys.every((keyboardKey) => isDown(keyboardKey, event));
      if (allKeyboardKeysDown) {
        callback();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [keyboardKeys, callback]);
};
