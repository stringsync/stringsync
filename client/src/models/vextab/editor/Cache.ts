import { Vextab } from '../Vextab';
import { last } from 'lodash';

export class Cache {
  private undoStack: Vextab[] = [];

  public push(vextab: Vextab): void {
    this.undoStack.push(vextab);
  }
  
  public peek(): Vextab | void {
    return last(this.undoStack);
  }
}
