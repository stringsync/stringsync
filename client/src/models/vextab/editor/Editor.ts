import { Vextab } from 'models';
import { Cache } from './Cache';
import { Selector } from './Selector';
import { Updater } from './Updater';

export class Editor {
  public readonly cache: Cache;
  public readonly selector: Selector;
  public readonly updater: Updater;

  public vextab: Vextab;

  constructor(vextab: Vextab) {
    this.cache = new Cache(this);
    this.selector = new Selector(this);
    this.updater = new Updater(this);

    this.vextab = vextab;
  }
}
