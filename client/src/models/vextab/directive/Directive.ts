import { Vextab } from 'models';
import { Extractor, Invoker } from './';

/**
 * This class is the primary interface for extracting and invoking directives. It has
 * a single public static interface Directive.extractAndInvoke, which takes care of directive
 * extraction and directive invokation. Callers should not need to interact with the
 * other directive classes. 
 */
export class Directive {
  /**
   * The primary interface for the directive class. It has an invariant on the vextab object
   * supplied to the function:
   *   The vextab should *not* be rendered in order to execute directives.
   * 
   * @param {Vextab} vextab 
   */
  public static extractAndInvoke(vextab: Vextab) {
    if (vextab.renderer.isRendered) {
      throw new Error('expected the vextab to not be rendered');
    }

    Extractor.extract(vextab);

    vextab.forEachElement(element => {
      element.directives.forEach(directive => {
        Invoker.invokePrerenderer(directive);
      })
    });
  }
}
