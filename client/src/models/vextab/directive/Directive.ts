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
   * @param {Vextab} vextab 
   */
  public static extractAndInvoke(vextab: Vextab): void {
    new Extractor(vextab).extract();
    new Invoker(vextab).invokePrerenderers();
  }
}
