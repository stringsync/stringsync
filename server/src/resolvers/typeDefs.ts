export const typeDefs = `
# Roots

type Query {
  users: [User]!
  user(input: UserInput!): User
}

type Mutation {
  signup(input: SignupInput!): SignupOutput!
  login(input: LoginInput!): LoginOutput!
  logout: LogoutOutput!
  authenticate: AuthenticateOutput!
  confirmEmail(input: ConfirmEmailInput!): ConfirmEmailOutput!
  resendConfirmation(input: ResendConfirmationInput!): ResendConfirmationOutput!
}

# Scalars

scalar Date

enum UserRoles {
  student
  teacher
  admin
}

# Types

type User {
  id: String!
  username: String!
  email: String!
  createdAt: Date!
  updatedAt: Date!
  confirmedAt: Date
  notations: [Notation]
  role: UserRoles!
}

type Notation {
  id: String!
}

# Inputs and Outputs

input UserInput {
  id: String!
}

type UserOutput {
  user: User!
}

type AuthenticateOutput {
  user: User!
}

input SignupInput {
  username: String!
  email: String!
  password: String!
}

type SignupOutput {
  user: User!
}

input LoginInput {
  emailOrUsername: String!
  password: String!
}

type LoginOutput {
  user: User!
}

input ConfirmEmailInput {
  confirmationToken: String!
}

type ConfirmEmailOutput {
  user: User!
}

input ResendConfirmationEmailInput {
  email: String!
}

type ResendConfirmationEmailOutput {
  email: String!
}
`;
