export interface NotationState {
  index: {
    fetchedAt: number;
    notations: Notation[];
  },
  show: Notation,
  edit: Notation
}
