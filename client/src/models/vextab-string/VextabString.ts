import { last, get, trim, isEqual } from 'lodash';

interface IMeasureGroup {
  options: object;
  measures: string[];
}

// Options utility functions
const isOptionsStr = (str: string): boolean => str.includes('key=') && str.includes('time=');
const toOptionsObject = (optionsStr: string): object => (
  optionsStr.split(/\s+/).reduce((options, str) => {
    const [key, value] = str.split('=');
    options[key] = value || null;
    return options;
  }, {})
);
const toOptionsStr = (optionsObj: object): string => {
  const optionsStr = Object.keys(optionsObj).map(key => `${key}=${optionsObj[key]}`).join(' ');
  return `tabstave ${optionsStr}`;
};

const BASE_OPTS = {
  clef: 'none',
  notation: 'true'
};

const SPACING = 50; // px

export class VextabString {
  public readonly raw: string;

  constructor(raw: string) {
    this.raw = raw;
  }

  /**
   * Returns a raw vextab string that is divided up into groups that obey
   * the maxMeasuresPerLine argument.
   *
   * @param maxMeasuresPerLine number
   */
  public asMeasures(maxMeasuresPerLine: number): string {

    if (maxMeasuresPerLine < 1) {
      throw new RangeError(`expected maxMeasuresPerLine to be >= 1: ${maxMeasuresPerLine}`);
    }

    // Create groupings similar to measureGroups, but adheres to maxMeasuresPerLine
    const lines: IMeasureGroup[] = this.measureGroups.reduce((groups: IMeasureGroup[], measureGroup) => {
      const { options, measures } = measureGroup;
      const opts = Object.assign({}, options, BASE_OPTS);

      let line: string[] = [];
      measures.forEach((measure, ndx) => {
        if (line.length < maxMeasuresPerLine) {
          // Keep adding measures to the current line until we reach
          // maxMeasuresPerLine
          line.push(measure);
        } else {
          // When we reach the maxMeasuresPerLine length, we push a
          // new group
          groups.push({ options: opts, measures: line });
          line = [measure];
        }

        if (ndx === measures.length - 1) {
          // The next measureGroup will have new options, so we push
          // a new group if on the last measure of measureGroup
          groups.push({ options: opts, measures: line });
        }
      });

      return groups;
    }, []);

    // Reconstruct the vextabString
    return lines.reduce((rows: string[], line) => {
      rows.push(`options space=${SPACING}`);
      rows.push(toOptionsStr(line.options));
      // Assume all measures have the single bar line
      line.measures.forEach(measure => rows.push(`notes | ${measure}`));
      return rows;
    }, []).join('\n');
  }

  /**
   * This method takes the raw vextabString and groups them by
   * contiguous sets of matching options.
   */
  private get measureGroups(): IMeasureGroup[] {
    return trim(this.raw).split('\n').map(trim).reduce((groups: IMeasureGroup[], line, ndx) => {
      // The last group will always be the 'current' group
      const group = last(groups);
      const groupOptions = get(group, 'options');

      // If we have an options string, compare it to the last group's
      // options. If there is no last group or the options are different,
      // push a new group into the groups array.
      if (isOptionsStr(line)) {
        const lineOptions = toOptionsObject(line);
        if (!isEqual(groupOptions, lineOptions)) {
          groups.push({ options: lineOptions, measures: [] });
        }
      } else if (!group) {
        throw new Error(`formatter error: expected group at line ${ndx}`);
      } else if (!groupOptions) {
        throw new Error(`formatter error: expected options at line ${ndx}`);
      } else {
        // We did not encounter an options string and we have a current
        // group with options. This ensures that all measure groups belong
        // to a set of options.
        group.measures.push(line);
      }

      return groups;
    }, []);
  }
}
