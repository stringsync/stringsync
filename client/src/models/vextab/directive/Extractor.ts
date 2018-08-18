import { get, startsWith, partition } from 'lodash';
import { Vextab, MeasureElement } from 'models';

/**
 * This class is used to extract the custom directives from Vextab. The extraction process
 * is as follows:
 * 
 *   - For each MeasureElement in the Vextab
 *     - If a tab_note has an annotation that starts with "JSON=", consider that annotation
 *       a directive.
 *     - Remove that annotation so it doesn't render as text.
 *     - Create the Vexflow and StringSync data structures necessary for the directive.
 *       Insert them into the tab_notes array and Vextab (respectively) as necessary.
 *     - Create a directive object that a directive handler will act on later.
 *     - Add a directive reference to the StringSync data structure.
 */
export class Extractor {
  /**
   * Convenient static method to avoid having to instantiate an extractor manually.
   * 
   * @param {Vextab} vextab 
   */
  public static extract(vextab: Vextab): Extractor {
    const extractor = new DirectiveExtractor(vextab);
    extractor.extract();
    return extractor;
  }

  /**
   * This function contains the implementation for determining if a modifier is a
   * directive or not.
   * 
   * @param {string} annotation
   * @returns {boolean}
   */
  public static isDirective(modifier: Vex.Flow.Modifier): boolean {
    // Hack around Vexflow's private attributes, since getters aren't defined for
    // each of these variables.
    const type: string | void = get(modifier, 'attrs.type');
    const text: string | void = get(modifier, 'text');

    return Boolean(
      type === 'Annotation' && text && startsWith(text, 'JSON=')
    );
  }

  public readonly vextab: Vextab;

  constructor(vextab: Vextab) {
    this.vextab = vextab;
  }

  /**
   * The primary function of the directive extractor. It modifies the vextab member variable
   * in place by removing modifiers on the tabNotes that return true for 
   * DirectiveExtractor.isDirective. Additionally, it will insert notes (as needed) in the
   * vextab's measures.
   */
  public extract(): void {
    this.vextab.measures.forEach(measure => {
      measure.elements.forEach(element => {
        this.mutateModifiersIntoDirectives(element);
      });
    });
  }

  private mutateModifiersIntoDirectives(element: MeasureElement): void {
    // We rely on the connection between the VexFlow and StringSync data structures to be
    // established before we perform the extraction.
    if (!element.isHydrated) {
      throw new Error('expected element to be hydrated before performing an extraction on it');
    }

    const tabNote: Vex.Flow.TabNote | void = get(element, 'vexAttrs.tabNote');

    if (!tabNote) {
      return;
    }

    const mods: Vex.Flow.Modifier[] = get(tabNote, 'modifiers');
    const [directiveMods, nonDirectiveMods] = partition(mods,  mod => DirectiveExtractor.isDirective(mod));

    // MUTATION!
    // Removes the directive modifiers from the tabNote object itself.
    (tabNote as any).modifiers = nonDirectiveMods;

    // Now, we create the directive object from the directiveMods to 
    // store on the measure element itself.
    element.directives = directiveMods.map(mod => {
      // FIXME: Overly complicated logic to hack JSON since Vextab handles commas differently
      const text: string = get(mod, 'text');
      const payload: Directive.IPayload = JSON.parse(text.split('=')[1].replace(/\;/g, ','));
      return { element, payload };
    });
  }
}
