import { useEffect } from 'react';

const PROPERTIES = ['user-select', '-webkit-user-select', '-moz-user-select', '-ms-user-select'];

export const useNoUserSelect = (element: HTMLElement) => {
  useEffect(() => {
    let prevUserSelect = PROPERTIES.reduce<string | null>((val, prop) => {
      return val || element.style.getPropertyValue(prop);
    }, null);

    PROPERTIES.forEach((prop) => {
      element.style.setProperty(prop, 'none');
    });

    return () => {
      PROPERTIES.forEach((prop) => {
        element.style.setProperty(prop, prevUserSelect);
      });
    };
  }, [element]);
};
