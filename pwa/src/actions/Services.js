import { get, last, head, filter, includes } from 'lodash';
import { SERVICES } from '../content/services';
// import { getAuthId } from "./Auth"

export const getService = () => {
  const lastUrlPathSegment = last(window.location.pathname.split('/'));
  return head(filter(SERVICES, service => get(service, 'slug') === lastUrlPathSegment));
};
