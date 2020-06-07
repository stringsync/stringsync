import { TypeormRepo } from './TypeormRepo';
import * as domain from '@stringsync/domain';
import { UserRepo } from '../types';
import { injectable } from 'inversify';
import { UserEntity } from '@stringsync/typeorm';

@injectable()
export class UserTypeormRepo extends TypeormRepo<domain.User> implements UserRepo {
  entityClass = UserEntity;
}
