import { IncludedObjects } from './IncludedObjects';
import { IResponse } from '../../@types/api/base';
import { merge } from 'lodash';

export interface ITransforms {
  [attrName: string]: (attr: any) => any;
}

/**
 * TThis method abstracts the complexity of managing included objects from the backend.
 *
 * @param response
 */
export const canonicalize = (response: IResponse, transforms: ITransforms = {}) => {
  const nextResponse = merge({}, response);

  const included = new IncludedObjects(nextResponse.included || []);

  nextResponse.data.map(data => {
    const { relationships } = data;

    // First, assign relationships to the attributes of the data object
    if (typeof relationships !== 'undefined') {
      Object.keys(relationships).forEach(rType => {
        data.attributes[rType] = included.fetch(relationships[rType].data);
      });
    }

    // Next, transform the object using the transforms argument
    Object.keys(transforms).forEach(attrName => {
      const transform = transforms[attrName];
      const attr = data.attributes[attrName];
      data.attributes[attrName] = Array.isArray(attr) ? attr.map(transform) : transform(attr);
    });

    return data;
  });

  return nextResponse;
};
