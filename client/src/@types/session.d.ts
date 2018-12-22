export interface ISession {
  signedIn: boolean;
  email: string;
  uid: string;
  id: number;
  image: string | null;
  name: string;
  provider: string;
  role: 'student' | 'teacher' | 'admin';
}
