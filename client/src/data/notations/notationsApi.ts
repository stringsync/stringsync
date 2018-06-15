
import * as actions from './notationsActions';
import { sortBy, groupBy, keyBy } from 'lodash';
import { Dispatch } from 'react-redux';

export const fetchAllNotations = () => async (dispatch: Dispatch) => {
  const response = await fetch('/api/v1/notations');
  const json: API.Base.IResponse = await response.json();

  const includedByTypeById = groupBy(json.included!, object => object.type);
};
