import Scalars from './Scalars';
import Query from './Query';
import Mutation from './Mutation';
import Book from './Book';
import { ITypedef } from 'graphql-tools';

const typeDefs: ITypedef[] = [Scalars, Query, Mutation, Book];

export default typeDefs;
