import { Line } from '../..';
import { VexTab as VextabGenerator, Artist } from 'vextab/releases/vextab-div.js';
import { get, zip, uniq } from 'lodash';
import { MeasureElement } from '../../music';
import { Bar, Note, Chord, Rest } from '../../music';

export type StaveNote = Vex.Flow.StaveNote | Vex.Flow.BarNote;
export type TabNote = Vex.Flow.TabNote | Vex.Flow.BarNote;

export interface IStave extends Vex.Flow.Stave {
  note_notes: Vex.Flow.Note[];
  tab_notes: Vex.Flow.Note[];
}

// The purpose of this class is to link Vexflow note instances with StringSync's note system.
export class VextabHydrator {
  public static HYDRATABLES = ['BAR', 'NOTE', 'CHORD', 'REST']

  public static typeof(vexObject: any) {
    if (get(vexObject, 'keys', []).some((key: string) => key.startsWith('r'))) {
      return 'REST';
    }

    switch (get(vexObject, 'attrs.type')) {
      case 'BarNote':
        return 'BAR';
      case 'StaveNote':
        return (vexObject as Vex.Flow.StaveNote).getKeys().length > 1 ? 'CHORD' : 'NOTE';
      case 'TabNote':
        return (vexObject as Vex.Flow.TabNote).getPositions().length > 1 ? 'CHORD' : 'NOTE';
      case 'GhostNote':
        return 'REST';
      default:
        return undefined;
    }
  }

  public static hydrate (line: Line, artist: typeof Artist): VextabHydrator {
    const vextabGenerator = new VextabGenerator(artist);

    // Mimics the behavior of the original Vextab
    // See https://github.com/0xfe/vextab/blob/master/src/vextab.coffee#L204
    vextabGenerator.elements = [line.rawStruct];
    vextabGenerator.generate();
    vextabGenerator.valid = true;

    const hydrator = new VextabHydrator(line, artist.staves[0]);
    hydrator.hydrate();

    return hydrator;
  }

  public line: Line;
  public stave: IStave;

  constructor(line: Line, stave: IStave) {
    this.line = line;
    this.stave = stave;
  }

  /**
   * This is the primary method for the VextabHydrator. Its purpose to to link the Vexflow
   * data structures with the StringSync wrappers.
   */
  public hydrate(): void {
    this.line.stave = this.stave;

    // Compute an array of arrays of notes for the given line, where an array
    // element represents a measure.
    //
    // Each measure has the following stucture: [BarNote, VexNote, VexNote, VexNote, ...]
    const noteMeasures = this.getMeasures<StaveNote>(this.stave.note_notes as StaveNote[]);
    const tabMeasures = this.getMeasures<TabNote>(this.stave.tab_notes as TabNote[]);

    const hydratables = VextabHydrator.HYDRATABLES;
    const wrapperMeasures = this.line.measures.map(measure => 
      measure.elements.filter(el => hydratables.includes(el.type))
    );

    this.validateMeasures(noteMeasures, tabMeasures, wrapperMeasures);

    wrapperMeasures.forEach((wrapperMeasure, measureNdx) => {
      wrapperMeasure.forEach((wrapper, wrapperNdx) => {
        const staveNote = noteMeasures[measureNdx][wrapperNdx];
        const tabNote = tabMeasures[measureNdx][wrapperNdx];

        if (wrapper.type === 'BAR') {
          (wrapper as Bar).hydrate(staveNote as Vex.Flow.BarNote, tabNote as Vex.Flow.BarNote);
        } else {
          (wrapper as Note | Chord | Rest).hydrate(
            staveNote as Vex.Flow.StaveNote, tabNote as Vex.Flow.TabNote
          );
        }
      });
    });
  }

  private getMeasures<T>(notes: T[]): T[][] {
    const firstNoteType = VextabHydrator.typeof(notes[0]);

    if (firstNoteType !== 'BAR') {
      throw new Error(`expected the first note type to be 'BAR', got: ${firstNoteType}` );
    }

    const line: T[][] = [];
    let measure: T[] = [notes[0]];
    notes.slice(1).forEach((note, ndx) => {
      if (VextabHydrator.typeof(note) === 'BAR') {
        line.push(measure);
        measure = [];
      }

      measure.push(note);
    });

    line.push(measure);

    return line;
  }

  /**
   * Throws errors if the arguments have some discrepancy with each other
   * 
   * @param noteMeasures Measures from Vexflow's stave.note_notes
   * @param tabMeasures Measures from Vexflow's stave.tab_notes
   * @param wrapperMeasures Measures constructed using StringSync's measure system
   */
  private validateMeasures(
    noteMeasures: StaveNote[][],
    tabMeasures: TabNote[][],
    wrapperMeasures: MeasureElement[][]
  ): void {
    const groups = zip(noteMeasures, tabMeasures, wrapperMeasures);

    // Validate length
    groups.forEach(group => {
      if (uniq(group.map(measures => measures!.length)).length > 1) {
        throw new Error('expected noteMeasures, tabMeasures, and wrapperMeasures to have the same length');
      }
    });

    // Validate types match
    groups.forEach(group => {
      const [notes, tabs, wrappers] = group;

      zip(notes as StaveNote[], wrappers as MeasureElement[]).forEach(pair => {
        const [note, wrapper] = pair;

        if (VextabHydrator.typeof(note!) !== wrapper!.type) {
          throw new Error('expected noteMeasures and wrapperMeasures to map types exactly');
        }
      });

      zip(tabs as TabNote[], wrappers as MeasureElement[]).forEach(pair => {
        const [tab, wrapper] = pair;

        if (VextabHydrator.typeof(tab!) !== wrapper!.type) {
          throw new Error('expected tabMeasures and wrapperMeasures to map types exactly');
        }
      })
    })
  }
}
