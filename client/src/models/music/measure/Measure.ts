import { Bar, Note, Rest, Line, Chord } from 'models/music';
import { VextabMeasureSpec, Directive } from 'models/vextab';
import { compact, get, flatMap, last } from 'lodash';
import { Annotations } from '../annotations';
import { Tuplet } from '../tuplet';
import { Rhythm } from '../rhythm';

export type MeasureElement = Note | Rest | Bar | Chord;

export class Measure {
  public static tickableTypes = ['NOTE', 'CHORD', 'REST'];

  public readonly spec: VextabMeasureSpec;
  public readonly id: number;
  public readonly type = 'MEASURE';

  public line: Line | void;
  public elements: MeasureElement[];
  public annotations: Annotations[] = [];
  public directives: Directive[] = [];

  constructor(elements: MeasureElement[], id: number, spec: VextabMeasureSpec) {
    if (elements[0].type !== 'BAR') {
      throw new Error(`expected the first element to have type BAR, got: ${elements[0].type}`);
    }

    this.id = id;
    this.elements = elements;
    this.spec = spec;
  }

  public get tickables(): Array<Note | Chord | Rest> {
    const tickableTypes = new Set(Measure.tickableTypes);
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

  public remove(element: MeasureElement) {
    const ndx = this.elements.indexOf(element);

    if (ndx > -1) {
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
