import { Bar, Note, Rest, Line, Chord } from 'models/music';
import { Spec, Annotations, Tuplet, Directive } from 'models';
import { compact, get, flatMap, last } from 'lodash';
import { VextabElement } from '../../vextab';
import { hash } from 'utilities';

export class Measure {
  public static TICKABLE_TYPES = ['NOTE', 'CHORD', 'REST'];

  public readonly type = 'MEASURE';
  public readonly clef = 'none';
  public readonly notation = true;

  public bar: Bar;
  public elements: VextabElement[];
  public annotations: Annotations[] = [];
  public directives: Directive[] = [];

  constructor(bar: Bar, elements: VextabElement[]) {
    this.bar = bar;
    this.elements = elements;
  }

  public get specHash(): number {
    const { key, timeSignature } = this.bar;
    const { clef, notation } = this;

    return hash(`${clef}${notation}${key.note.literal}${timeSignature.toString()}`);
  }

  public get specStruct() {
    const { key, timeSignature } = this.bar;

    return [
      { key: 'clef',     value: 'none' },
      { key: 'notation', value: 'true' },
      { key: 'key',      value: key.note.literal },
      { key: 'time',     value: timeSignature.toString() }
    ];
  }

  public get tickables(): Array<Note | Chord | Rest> {
    const tickableTypes = new Set(Measure.TICKABLE_TYPES);
    return this.elements.filter(element => tickableTypes.has(element.type)) as Array<Note | Chord | Rest>;
  }

  /**
   * Iterates through the Chord and Note elements, and flat maps their pos getters.
   */
  public get positions(): Guitar.IPosition[] {
    const targets = this.elements.filter(element => (
      element.type === 'NOTE' || element.type === 'CHORD'
    )) as Array<Chord | Note>;

    return flatMap(targets, target => target.positions);
  }

  public get struct(): Vextab.ParsedStruct[] {
    return flatMap(this.elements, element => {
      if (get(element, 'rhythm.isGrace', false)) {
        // Grace notes are implemented via directives, so we ignore them here
        return [];
      } else {
        return compact([
          get(element, 'rhythm.struct'),
          element.struct,
          ...element.annotations.map(annotation => annotation.struct),
          ...element.directives.map(directive => directive.struct),
          this.tupletStruct(element)
        ]);
      }
    });
  }

  public clone(): Measure {
    const elements = this.elements.map(element => element.clone());
    const spec = this.spec.clone();
    return new Measure(elements, this.id, spec.clone());
  }

  public remove(element: MeasureElement) {
    if (element instanceof Bar && this.line) {
      // remove the measure from the line
      this.line.measures = this.line.measures.filter(measure => measure !== this);
      this.line = undefined;
    } else {
      const ndx = this.elements.indexOf(element);
      this.elements.splice(ndx, 1);
    }
  }

  private tupletStruct(element: MeasureElement): Vextab.Parsed.ITuplet | void {
    // We have to deal with tuplets at the measure level since it requires us
    // to look backwards.
    const tuplet = get(element, 'rhythm.tuplet') as Tuplet | void;

    if (!tuplet) {
      return;
    }

    // compute tuplet groups, which are arrays of arrays of rhythms
    const tuplets = compact(this.elements.map(el => get(el, 'rhythm.tuplet'))) as Tuplet[];

    const tupletGroups = tuplets.reduce((groups, tup) => {
      const lastGroup = last(groups);

      // A group is satisfied if the first rhythm's tuplet's value is equal
      // to the group size
      if (!lastGroup || get(lastGroup[0], 'value', -1) === lastGroup.length) {
        groups.push([tup]);
        return groups;
      } else {
        lastGroup.push(tup);
      }

      return groups;
    }, [] as Tuplet[][]);
    
    // Out of each tupletGroup, we take the last tuplet, since this is
    // the element that we'll act on and push the tuplet
    const actionTuplets = tupletGroups.reduce((actionTups, tupletGroup) => {
      const lastTuplet = last(tupletGroup);

      if (lastTuplet) {
        actionTups.add(lastTuplet.id);
      }

      return actionTups;
    }, new Set() as Set<number>);

    return actionTuplets.has(tuplet.id) ? tuplet.struct : undefined;
  }
};
