import { useEffect } from 'react';

const PROPERTIES = ['touch-callout', '-webkit-touch-callout', '-moz-touch-callout', '-ms-touch-callout'];

export const useNoTouchCallout = (element: HTMLElement) => {
  useEffect(() => {
    let prevTouchCallout = PROPERTIES.reduce<string | null>((val, prop) => {
      return val || element.style.getPropertyValue(prop);
    }, null);

    PROPERTIES.forEach((prop) => {
      element.style.setProperty(prop, 'none');
    });

    return () => {
      PROPERTIES.forEach((prop) => {
        element.style.setProperty(prop, prevTouchCallout);
      });
    };
  }, [element]);
};
