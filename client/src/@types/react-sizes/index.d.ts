declare module 'react-sizes' {
  type ViewportPredicate = ({ width }: { width: number }) => boolean;

  export interface IComponentWithSizesState {
    initialSizes: {
      width: number | null;
      height: number | null;
      canUseDOM: boolean;
    };
    propsToPass: any;
  }

  export type ComponentWithSizesWrapper = (WrappedComponent: React.Component<any, any>) => ComponentWithSizes;

  export class ComponentWithSizes extends React.Component<any, IComponentWithSizesState> {
    dispatchSizes: () => void;
  }

  export interface IWithSizes {
    (...args: any): ComponentWithSizesWrapper;
    isMobile: ViewportPredicate;
    isTablet: ViewportPredicate;
    isDesktop: ViewportPredicate;
  }
}
