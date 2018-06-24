// This file contains the mappings of scale names to arrays of scale degrees.
export const scales: { [key: string]: string[] } = Object.freeze({
  aeolian: ['1', '2', 'b3', '4', '5', 'b6', 'b7'],
  chromatic: ['1', 'b2', '2', 'b3', '3', '4', 'b5', '5', '#5', '6', 'b7', '7'],
  dorian: ['1', '2', 'b3', '4', '5', '6', 'b7'],
  ionian: ['1', '2', '3', '4', '5', '6', '7'],
  locrian: ['1', 'b2', 'b3', '4', 'b5', 'b6', 'b7'],
  lydian: ['1', '2', '3', '#4', '5', '6', '7'],
  mixolydian: ['1', '2', '3', '4', '5', '6', 'b7'],
  phrygian: ['1', 'b2', 'b3', '4', '5', 'b6', 'b7']
});
