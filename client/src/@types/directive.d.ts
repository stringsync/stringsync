declare namespace Directive {
  export interface IPayload {
    type: DirectiveTypes;
  }

  export interface IDirective {
    element: MeasureElement;
    payload: IPayload;
  }

  export type DirectiveTypes = 'GRACE_NOTE' | 'NOTE_SUGGESTIONS';
}