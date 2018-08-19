declare namespace Directive {
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