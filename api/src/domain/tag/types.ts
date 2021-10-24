// https://typegraphql.com/docs/enums.html#interoperability
export enum TagCategory {
  GENRE = 'GENRE',
  DIFFICULTY = 'DIFFICULTY',
}

export interface Tag {
  id: string;
  category: TagCategory;
  name: string;
}
