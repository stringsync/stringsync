declare namespace Vextab {
  namespace Parsed {
    export type Struct = IStave | Note | IOption;

    export interface IStave {
      element: 'tabstave' | 'stave';
      options: IOption[];
      notes: Note[];
      text: any[];
    }

    export interface IOption {
      key: string;
      value: string;
    }

    export type Note =
      IAnnotations | IBar | IChord |
      IKey | IRest | IPosition |
      ITabstave | ITuplet | ITime |
      ITimeSignature | IText

    export interface IAnnotations {
      command: 'annotations';
      params: string[];
    }

    export type IBarTypes = 'single' | 'double' | 'end' | 'repeat-end' | 'repeat-begin' | 'repeat-both';

    export interface IBar {
      command: 'bar';
      type: IBarTypes;
    }

    export interface IChord {
      chord: IPosition[];
      articulation: string | void;
      decorator: string | void;
    }

    export interface IKey {
      key: 'key';
      value: string;
    }

    export interface IRest {
      command: 'rest';
      params: {
        position: number;
      }
    }

    export interface IPosition {
      string: string;
      fret: string;
      articulation: string | void;
      decorator: string | void;
    }

    export interface ITabstave {
      options: IOptions;
      notes: Note[];
      text: IText[];
    }

    export interface ITuplet {
      command: 'tuplet';
      params: {
        tuplet: string;
      }
    }

    // Used for specifying rhythms, not time signatures
    export interface ITime {
      time: string;
      dot: boolean;
    }

    export interface ITimeSignature {
      key: 'time';
      value: string;
    }

    export interface IText {
      text: string;
    }
  }
}
