import { Note } from 'models/music';
import { ScaleDegree, scales } from './';
import { flatMap } from 'lodash';

/**
 * The purpose of this class is to transform a key and an array of ScaleDegree instances
 * to a collection of notes.
 */
export class Scale {
  /**
   * Fetches the degreeLiterals from './scales.js', then constructs a scale using those
   * literals.
   *
   * @param {string} key
   * @param {keyof scales} scaleName
   */
  public static for(key: string, scaleName: string) {
    const degreeLiterals: string[] = scales[scaleName];

    if (!degreeLiterals) {
      throw new Error(`${scaleName as string} scale was not found`);
    }

    return new Scale(key, degreeLiterals);
  }

  public readonly key: Note;
  public readonly degrees: ScaleDegree[];

  constructor(keyLiteral: string, degreeLiterals: string[]) {
    this.key = new Note(keyLiteral, 4);
    this.degrees = degreeLiterals.map(literal => new ScaleDegree(literal, this));
  }

  /**
   * The primary purpose of the Scale service.
   * Returns an array of note objects that correspond to the key, degrees, and octaves.
   * The notes will be in the sort order dictated by Note.sort.
   * 
   * @param {Array<number>}
   * @returns {Note[]}
   */
  public notes(octaves: number[] = [4]): Note[] {
    const root = new ScaleDegree('1', this);

    const notes = flatMap(this.degrees, degree => (
      octaves.map(octave => {
        // The seed is the note used to start the scale for a given octave
        const seed = this.key.clone();
        seed.octave = octave;
        return seed.step(root.distance(degree));
      })
    ));

    return Note.sort(notes);
  }
}
