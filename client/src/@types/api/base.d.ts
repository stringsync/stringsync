import { IIncluded, ILinks } from '../json-api';

export interface IResponse {
  data?: any;
  included?: IIncluded[];
  links?: ILinks;
}