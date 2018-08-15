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

}
