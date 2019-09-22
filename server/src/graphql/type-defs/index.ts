import Scalar from './Scalar';
import Mutation from './Mutation';
import { ITypedef } from 'apollo-server';

import Query from './Query';
import User from './User';

const typeDefs: ITypedef[] = [Scalar, Query, Mutation, User];

export default typeDefs;
