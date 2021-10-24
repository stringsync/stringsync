export enum TagCategory {
  Genre = 'genre',
  Difficulty = 'difficulty',
}

export interface Tag {
  id: string;
  category: TagCategory;
  name: string;
}
