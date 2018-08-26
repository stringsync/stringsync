import { Vextab } from 'models';
import { Extractor, Invoker } from './';
import { merge } from 'lodash';
import { VextabElement } from '../Vextab';
import { Bar } from '../../music';

export type DirectiveTypes = 'GRACE_NOTE' | 'NOTE_SUGGESTIONS';

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

  public type: DirectiveTypes;
  public element: VextabElement;
  public payload: any;

  // FIXME: Fix the annotation for this class
  constructor(type: DirectiveTypes, element: VextabElement, payload: any) {
    this.type = type;
    this.element = element;
    this.payload = payload;
  }

  public get struct(): Vextab.Parsed.IAnnotations {
    const json = JSON.stringify(Object.assign({}, { type: this.type }, this.payload));
    return { command: 'annotations', params: [`JSON=${json.replace(/,/g, ';')}`] }
  }

  public clone(element: VextabElement): Directive {
    const payload = merge({}, this.payload);
    return new Directive(this.type, element, payload);
  }
}
