import { Vextab } from 'models';
import { Cache } from './Cache';
import { Selector } from './Selector';
import { Updater } from './Updater';
import { get } from 'lodash';

export class Editor {
  public readonly cache: Cache;
  public readonly selector: Selector;
  public readonly updater: Updater;

  private $vextab: Vextab;

  constructor(vextab: Vextab) {
    this.cache = new Cache();
    this.selector = new Selector(this);
    this.updater = new Updater(this);

    this.$vextab = vextab;
  }

  get vextab(): Vextab {
    return this.$vextab;
  }

  set vextab(vextab: Vextab) {
    const lastVextabId = get(this.cache.peek(), 'id');

    if (lastVextabId !== vextab.id) {
      this.cache.push(vextab);
      this.$vextab = vextab; 
    }
  }
}
