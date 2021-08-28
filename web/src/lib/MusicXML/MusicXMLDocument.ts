/**
 * This class is a wrapper around raw MusicXML.
 *
 * This class simply abstracts away having to query and mutate a raw MusicXML document. It does not understand the
 * semantics of each element. Instead, it maintains the invariants of each element. It is up to the caller to determine
 * the semantics and call the methods on this class to achieve a goal.
 *
 * For example, the note element has the following spec:
 *
 * https://www.w3.org/2021/06/musicxml40/musicxml-reference/elements/note/
 *
 * This class will prevent callers from violating this spec.
 */
export class MusicXMLDocument {
  static parse(xml: XMLDocument) {}
}
