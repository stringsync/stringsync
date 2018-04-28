export const LITERALS = Object.freeze([
  '1', '#1', 'b2', '2', '#2', 'b3', '3', '4', '#4', 'b5', '5', '#5', 'b6', '6', '#6', 'b7', '7'
]);

export const LITERALS_SET = Object.freeze(new Set(LITERALS));

export const MODIFIERS = Object.freeze(['b', '#']);

export const VALUES_BY_LITERAL = Object.freeze({
  '1': 0,
  '#1': 1,
  'b2': 1,
  '2': 2,
  '#2': 3,
  'b3': 3,
  '3': 4,
  '4': 5,
  '#4': 6,
  'b5': 6,
  '5': 7,
  '#5': 8,
  'b6': 8,
  '6': 9,
  '#6': 10,
  'b7': 10,
  '7': 11
});
