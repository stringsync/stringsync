import Scalars from './Scalars';
import Mutation from './Mutation';
import { ITypedef } from 'apollo-server';

import Query from './Query';
import Book from './Book';
import User from './User';

const typeDefs: ITypedef[] = [Scalars, Query, Mutation, Book, User];

export default typeDefs;
