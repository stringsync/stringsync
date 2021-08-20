type Converter = (value: number) => number;

// All conversions are to milliseconds.

export const ms: Converter = (v) => v;
export const sec: Converter = (v) => ms(v) * 1000;
export const min: Converter = (v) => sec(v) * 60;
export const bpm = (bpm: number): Converter => (v) => min(v / bpm);
