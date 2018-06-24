declare namespace Vextab {
  export type ParsedStruct = Parsed.IOptions | Parsed.Notes;
  export type ElementTypes = 'tabstave' | 'stave';

  namespace Parsed {
    export interface ILine {
      element: ElementTypes;
      options: IOptions[];
      notes: Note[];
      text: any[];
    }

    export interface IOptions {

    }

    export type Note = Parsed.IAnnotations | Parsed.IBar | Parsed.IChord | Parsed.IKey | Parsed.IRest;

    export interface IAnnotations {

    }

    export interface IBar {

    }

    export interface IChord {

    }

    export interface IClef {

    }

    export interface IKey {

    }

    export interface IRest {

    }
  }
}
