export interface User {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  username: string;
  email: string;
}

export type PartialUser = Partial<User>;
