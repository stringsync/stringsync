import { Vextab } from 'models';
import { Cache } from './Cache';
import { Selector } from './Selector';
import { Updater } from './Updater';
import { get } from 'lodash';

export class Editor {
  public static DEFAULT_VEXTAB_STRING = `tabstave clef=none notation=true key=C time=4/4`;

  public readonly cache: Cache;
  public readonly selector: Selector;
  public readonly updater: Updater;

  private $vextab: Vextab;

  constructor(vextab: Vextab) {
    this.cache = new Cache();
    this.selector = new Selector(vextab);
    this.updater = new Updater(this);

    this.$vextab = vextab;
  }

  get vextab(): Vextab {
    return this.$vextab;
  }

  set vextab(vextab: Vextab) {
    const lastVextabId: number = get(this.cache.peek(), 'id', -1);

    if (lastVextabId !== vextab.id) {
      this.cache.push(vextab);
      this.selector.vextab = vextab;
      this.$vextab = vextab;
    }
  }
}
