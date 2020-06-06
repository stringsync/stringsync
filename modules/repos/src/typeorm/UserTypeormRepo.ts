import { TypeormRepo } from './TypeormRepo';
import * as domain from '@stringsync/domain';
import { UserRepo } from '../types';

export class UserTypeormRepo extends TypeormRepo<domain.User> implements UserRepo {}
