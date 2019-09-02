import { query } from '@/util/gql';

export const signup = query<
  { signup: { id: string; username: string; token: string } },
  { userInput: { username: string; password: string } }
>(`
  mutation ($userInput: UserInput!) {
    signup(userInput: $userInput) {
      id
      username
      token
    }
  }
`);

export const login = query<
  { login: { id: string; username: string; token: string } },
  { userInput: { username: string; password: string } }
>(`
  mutation ($userInput: UserInput!) {
    login(userInput: $userInput) {
      id
      username
      token
    }
  }
`);
