import { SetReturnToRouteAction } from './types';
import { SET_RETURN_TO_ROUTE } from './constants';

export const setReturnToRoute = (
  returnToRoute: string
): SetReturnToRouteAction => ({
  type: SET_RETURN_TO_ROUTE,
  payload: { returnToRoute },
});
