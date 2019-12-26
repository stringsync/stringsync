// import React from 'react';
// import { StoreViewportSync } from './StoreViewportSync';
// import { getTestComponent } from '../../testing';
// import { render } from '@testing-library/react';

// const resizeWindowWidth = (width: number) => {
//   (window as any).innerWidth = width;
//   window.dispatchEvent(new Event('resize'));
// };

// it.each([
//   { width: 574, breakpointName: 'xs' },
//   { width: 766, breakpointName: 'sm' },
//   { width: 990, breakpointName: 'md' },
//   { width: 1198, breakpointName: 'lg' },
//   { width: 1598, breakpointName: 'xl' },
// ])(
//   'updates the store with the breakpoint name',
//   ({ width, breakpointName }) => {
//     const { TestComponent, store } = getTestComponent(StoreViewportSync, {});

//     const component = <TestComponent />;
//     const { rerender } = render(component);
//     resizeWindowWidth(width);
//     rerender(component);

//     expect(store.getState().viewport.breakpointName).toBe(breakpointName);
//   }
// );
