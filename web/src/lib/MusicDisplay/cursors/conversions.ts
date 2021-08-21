type Converter = (value: number) => number;

// All conversions are to milliseconds.

export const ms: Converter = (v) => v;
export const sec: Converter = (v) => ms(v) * 1000;
export const min: Converter = (v) => sec(v) * 60;

/**
 * @param {number} numQuarterNotesPerMin aka bpm
 */
export const bpm = (numQuarterNotesPerMin: number): Converter => (numWholeNotes) => {
  return min((numWholeNotes * 4) / numQuarterNotesPerMin);
};
