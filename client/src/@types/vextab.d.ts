declare namespace Vextab {
  export type ParsedStruct = Parsed.IOptions | Parsed.Notes;
  export type ElementTypes = 'tabstave' | 'stave';

  namespace Parsed {
    export interface ILine {
      element: ElementTypes;
      options: IOption[];
      notes: Note[];
      text: any[];
    }

    export type Note =
      IAnnotations | IBar | IChord |
      IKey | IRest | IPosition |
      ITabstave | ITuplet | ITime

    export interface IAnnotations {
      params: string[];
    }

    export type IBarTypes = 'single' | 'double' | 'end' | 'repeat-end' | 'repeat-begin' | 'repeat-both';

    export interface IBar {
      type: IBarTypes;
    }

    export interface IChord {
      chord: IPosition[];
      articulation?: string;
      decorator?: string;
    }

    export interface IClef {

    }

    export interface IKey {

    }

    export interface IRest {
      params: {
        position: number;
      }
    }

    export interface IPosition {
      string: string;
      fret: string;
      articulation?: string;
      decorator?: string;
    }

    export interface ITabstave {
      options: IOptions;
      notes: Note[];
      text: IText[];
    }

    export interface IOption {
      key: string;
      value: string;
    }

    export interface ITuplet {
      params: {
        tuplet: number;
      }
    }

    export interface ITime {
      time: number;
      dot?: string;
    }

    export interface IText {
      text: string;
    }
  }
}
