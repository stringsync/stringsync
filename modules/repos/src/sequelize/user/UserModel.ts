import * as domain from '@stringsync/domain';
import { Model } from 'sequelize';

export interface UserModel extends Model, domain.User {}
