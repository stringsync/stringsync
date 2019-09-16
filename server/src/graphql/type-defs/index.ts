import Scalars from './Scalars';
import { ITypedef } from 'apollo-server';

import Query from './Query';
import Book from './Book';
import User from './User';

import Mutation from './Mutation';

const typeDefs: ITypedef[] = [Scalars, Query, Mutation, Book, User];

export default typeDefs;
