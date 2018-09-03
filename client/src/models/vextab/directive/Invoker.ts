import { Vextab } from 'models';
import { Flow } from 'vexflow';
import { Directive } from './Directive';
import { Rhythm, Note, Chord } from '../../music';

const DEFAULT_TUNING = new (Flow as any).Tuning();

/**
 * The purpose of this class is to encapsulate the logic of invoking directives. It has one
 * primary public static interface, Invoker.invokePrerenderers, which _potentially_ modifies
 * vextab in place. React Components should not call this method. Instead, they should use
 * the interface provided by Directive.
 */
export class Invoker {
  public static PRERENDER_DIRECTIVE_TYPES = ['GRACE_NOTE'];
  public static DEFAULT_GRACE_NOTE_PAYLOAD = {
    duration: 8,
    slur: false
  };

  public vextab: Vextab;

  /** 
   * @param {Vextab} vextab 
   */
  constructor(vextab: Vextab) {
    this.vextab = vextab;
  }

  public invokePrerenderers(): void {
    if (this.vextab.scoreRenderer.isRendered) {
      throw new Error('expected the vextab to not be rendered');
    }

    const prerenderTypes = new Set(Invoker.PRERENDER_DIRECTIVE_TYPES);

    this.vextab.lines.forEach(line => {
      line.measures.forEach(measure => {
        // FIXME: Since we are inserting elements into the measure,
        // we create a new array. We should do a functional approach
        // here instead of mutating in place
        [...measure.elements].forEach(element => {
          const prerenderDirectives = element.directives.filter(directive => (
            prerenderTypes.has(directive.type)
          ));

          prerenderDirectives.forEach(directive => this.invoke(directive));
        })
      })
    })
  }

  private invoke(directive: Directive): void {
    switch (directive.type) {
      case 'GRACE_NOTE':
        this.invokeGraceNote(directive);
        return;
    }
  }

  private invokeGraceNote(directive: Directive): void {
    const payload = Object.assign(
      {}, Invoker.DEFAULT_GRACE_NOTE_PAYLOAD, directive.payload
    ) as Directive.Payload.IGraceNote;

    const { positions, duration, slur } = payload;
    const tuning = DEFAULT_TUNING; // FIXME to accept any tunings
    const { vexAttrs } = directive.element;

    if (!vexAttrs) {
      throw new Error('expected directive element to have vexAttrs defined to invoke a graceNote directive');
    }

    const tabNote = vexAttrs.tabNote as Vex.Flow.TabNote;
    const staveNote = vexAttrs.staveNote as Vex.Flow.StaveNote;

    // FIXME: Add annotations for GraceTabNote and GraceNoteGroups
    // Create graceTabNoteGroup
    const graceTabNote = new (Flow as any).GraceTabNote({ positions, duration: duration.toString() });
    const graceTabNoteGroup = new (Flow as any).GraceNoteGroup([graceTabNote], !!slur);

    // Append graceTabNoteGroup to tabNote's modifiers
    tabNote.addModifier(graceTabNoteGroup);
    graceTabNote.context = (tabNote as any).context;
    graceTabNote.setTickContext(tabNote.getTickContext());

    // Create graceNoteGroup
    const keys: string[] = graceTabNote.positions.map((pos: Guitar.IPosition) => (
      tuning.getNoteForFret(pos.fret.toString(10), pos.str.toString(10))
    ));
    const { fret, str } = graceTabNote.positions[0];
    const stemDirection = tuning.getValueForFret(fret, str) >= 59 ? -1 : 1; // B5
    const graceNote = new Flow.GraceNote({
      duration: duration.toString(),
      keys,
      slash: true,
      stem_direction: stemDirection
    });
    const graceNoteGroup = new Flow.GraceNoteGroup([graceNote], !!slur);

    // Apend graceNoteGroup to staveNote's modifier
    staveNote.addModifier(0, graceNoteGroup);
    (graceNote as any).context = (staveNote as any).context;
    graceNote.setTickContext(staveNote.getTickContext());

    // Insert a StringSync note before the current element so that the StringSync
    // data structures are up-to-date.
    const rhythm = new Rhythm('g', false);
    const notes = positions.map(pos => {
      const key = tuning.getNoteForFret(pos.fret.toString(10), pos.str.toString(10))
      const note = Note.from(key);
      note.positions = [pos];
      return note;
    });

    notes.forEach(note => note.rhythm = rhythm.clone());
    const ssDataStructure = notes.length > 1 ? new Chord(notes) : notes[0];
    ssDataStructure.rhythm = rhythm.clone();
    const { measure } = directive.element;

    if (!measure) {
      throw new Error('expected measure to be assigned elements');
    }

    // Assign the data structure to the measure
    const ndx = measure.elements.indexOf(directive.element);
    measure.elements.splice(ndx, 0, ssDataStructure);
    ssDataStructure.measure = measure;

    // Hydrate the new data structure
    ssDataStructure.hydrate(graceNote, graceTabNote);
  }
}
