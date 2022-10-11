import { get } from 'lodash'

/* DEV_VIEW should be used to test and change the view for development (customer || arbritary value) */

export const DEV_VIEW = 'customer'
export const DEFAULT_VIEW = 'customer'

export const showCustomerView = () => {
  const environment = process.env.NODE_ENV
  return environment === 'production' && get(window, ['location', 'host']).split('.')[0] === DEFAULT_VIEW || DEV_VIEW === DEFAULT_VIEW
}