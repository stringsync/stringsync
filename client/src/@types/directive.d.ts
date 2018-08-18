declare namespace Directive {
  export type DirectiveTypes = 'GRACE_NOTE' | 'NOTE_SUGGESTIONS';

  export interface IDirective<P = Payload.Types> {
    type: DirectiveTypes;
    element: MeasureElement;
    payload: P;
  }

  export type GraceNote = IDirective<Payload.IGraceNote>;
  export type NoteSuggestion = IDirective<Payload.INoteSuggestion>;

  namespace Payload {
    type Types = IGraceNote | INoteSuggestion;

    export interface IGraceNote {
      positions: Guitar.IPosition[];
      duration: string;
      slur?: boolean;
    }

    export interface INoteSuggestion {
      notes: string[];
      fromMeasureIndex: number;
      toMeasureIndex: number;
      description: string;
    }
  }
}