import { Bar, Note, Rest, Chord, Annotations, Tuplet, Line } from 'models/music';
import { Directive, VextabElement } from 'models/vextab';
import { compact, get, flatMap, last } from 'lodash';
import { hash, next, prev } from 'utilities';

/**
 * The purpose of this class is to manage a group of VextabElements.
 */
export class Measure {
  public static TICKABLE_TYPES = ['NOTE', 'CHORD', 'REST'];

  public readonly type = 'MEASURE';
  public readonly clef = 'none';
  public readonly notation = true;

  public bar: Bar;
  public elements: VextabElement[];
  public annotations: Annotations[] = [];
  public directives: Directive[] = [];
  public line: Line | void;

  constructor(bar: Bar, elements: VextabElement[]) {
    this.bar = bar;
    this.elements = elements;
  }

  public get index(): number {
    const measures = get(this.line, 'vextab.measures', []);
    return measures.indexOf(this);
  }

  public get next(): Measure | null {
    return next(this, get(this.line, 'measures', []));
  }

  public get prev(): Measure | null {
    return prev(this, get(this.line, 'measures', []));
  }

  public get specHash(): number {
    const { key, timeSignature } = this.bar;
    const { clef, notation } = this;

    return hash(`${clef}${notation}${key.note.literal}${timeSignature.toString()}`);
  }

  public get struct(): Vextab.Parsed.Note[] {
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

  public get optionsStruct() {
    const { key, timeSignature } = this.bar;

    return [
      { key: 'clef',     value: 'none' },
      { key: 'notation', value: 'true' },
      { key: 'key',      value: key.note.literal },
      { key: 'time',     value: timeSignature.toString() }
    ];
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

  public clone(): Measure {
    const elements = this.elements.map(element => element.clone());
    const bar = this.bar.clone();
    return new Measure(bar, elements);
  }

  private tupletStruct(element: VextabElement): Vextab.Parsed.ITuplet | void {
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
