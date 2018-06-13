declare namespace Reducers {
  type ViewportTypes = 'MOBILE' | 'TABLET' | 'DESKTOP';

  export interface Viewport {
    width: number;
    type: ViewportTypes;
  }
}
