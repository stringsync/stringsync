import { Vextab } from 'models';
import { Flow } from 'vexflow';

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
    if (this.vextab.renderer.isRendered) {
      throw new Error('expected the vextab to not be rendered');
    }

    const prerenderTypes = new Set(Invoker.PRERENDER_DIRECTIVE_TYPES);

    this.vextab.lines.forEach(line => {
      line.measures.forEach(measure => {
        measure.elements.forEach(element => {
          const prerenderDirectives = element.directives.filter(directive => (
            prerenderTypes.has(directive.type)
          ));

          prerenderDirectives.forEach(directive => this.invoke(directive));
        })
      })
    })
  }

  private invoke(directive: Directive.IDirective): void {
    switch (directive.type) {
      case 'GRACE_NOTE':
        this.invokeGraceNote(directive as Directive.GraceNote);
        return;
    }
  }

  private invokeGraceNote(directive: Directive.GraceNote): void {
    const payload = Object.assign({}, Invoker.DEFAULT_GRACE_NOTE_PAYLOAD, directive.payload);
    const { positions, duration, slur } = payload;
    const { tuning } = this.vextab;
    const { vexAttrs } = directive.element;

    if (!vexAttrs) {
      throw new Error('expected directive element to have vexAttrs defined to invoke a graceNote directive');
    }

    const tabNote: Vex.Flow.TabNote = vexAttrs.tabNote;
    const staveNote: Vex.Flow.StaveNote = vexAttrs.staveNote;

    // FIXME: Add annotations for GraceTabNote and GraceNoteGroups
    // Create graceTabNoteGroup
    const graceTabNote = new (Flow as any).GraceTabNote({ positions, duration: duration.toString(10) });
    const graceTabNoteGroup = new (Flow as any).GraceNoteGroup([graceTabNote], !!slur);

    // Append graceTabNoteGroup to tabNote's modifiers
    tabNote.addModifier(graceTabNoteGroup);
    graceTabNote.context = (tabNote as any).context;
    graceTabNote.setTickContext(tabNote.getTickContext());

    // Create graceNoteGroup
    const keys = graceTabNote.positions.map((pos: Guitar.IPosition) => (
      tuning.getNoteForFret(pos.fret.toString(10), pos.str.toString(10))
    ));
    const { fret, str } = graceTabNote.positions[0];
    const stemDirection = tuning.getValueForFret(fret, str) >= 59 ? -1 : 1; // B5
    const graceNote = new Flow.GraceNote({
      duration: duration.toString(10),
      keys,
      slash: true,
      stem_direction: stemDirection
    });
    const graceNoteGroup = new Flow.GraceNoteGroup([graceNote], !!slur);

    // Apend graceNoteGroup to staveNote's modifier
    staveNote.addModifier(0, graceNoteGroup);
    (graceNote as any).context = (staveNote as any).context;
    graceNote.setTickContext(staveNote.getTickContext());
  }
}
