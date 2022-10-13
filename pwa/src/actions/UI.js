import { get, first } from 'lodash'

/* DEV_VIEW should be used to test and change the view for development (customer || arbritary value) */

export const DEV_VIEW = 'customer'
export const DEFAULT_VIEW = 'customer'

export const showCustomerView = () => !process.env.NODE_ENV || process.env.NODE_ENV === 'development' ?
  DEV_VIEW === DEFAULT_VIEW : first(get(window, ['location', 'host']).split('.')) === DEFAULT_VIEW
