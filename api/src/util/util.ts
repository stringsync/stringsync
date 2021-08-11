export type Identifiable<T> = { id: T };

export const id = <T>(obj: Identifiable<T>): T => obj.id;
