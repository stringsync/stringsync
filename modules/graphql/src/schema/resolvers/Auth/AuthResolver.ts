import { Resolver } from 'type-graphql';
import { injectable } from 'inversify';

@Resolver()
@injectable()
export class AuthResolver {}
