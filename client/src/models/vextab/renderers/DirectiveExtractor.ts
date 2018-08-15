import { get, startsWith } from 'lodash';

/**
 * This class is used to extract the custom directives from a Vexflow Artist's stave. The
 * extract process is as follows:
 * 
 *   - For each tab_note
 *     - If a tab_note has an annotation that starts with "JSON=", consider that annotation
 *       a directive.
 *     - Remove that annotation so it doesn't render as text.
 *     - Create the Vexflow and StringSync data structures necessary for the directive.
 *       Insert them into the tab_notes array and Vextab (respectively) as necessary.
 *     - Create a directive object that a directive handler will act on later.
 *     - Add a directive reference to the StringSync data structure.
 */
export class DirectiveExtractor {
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
}
