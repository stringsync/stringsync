export const LITERALS = Object.freeze([
  '1', '#1', 'b2', '2', '#2', 'b3', '3', '4', '#4', 'b5', '5', '#5', 'b6', '6', '#6', 'b7', '7'
]);

export const LITERALS_SET = Object.freeze(new Set(LITERALS));

export const MODIFIERS = Object.freeze(['b', '#']);

export const VALUES_BY_LITERAL = Object.freeze({
  '#1': 1,
  '#2': 3,
  '#4': 6,
  '#5': 8,
  '#6': 10,
  '1': 0,
  '2': 2,
  '3': 4,
  '4': 5,
  '5': 7,
  '6': 9,
  '7': 11,
  'b2': 1,
  'b3': 3,
  'b5': 6,
  'b6': 8,
  'b7': 10
});
