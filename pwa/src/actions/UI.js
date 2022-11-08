import { get, first } from 'lodash'

export const DEV_VIEW = 'customere'
export const DEFAULT_VIEW = 'customer'

export const showCustomerView = () => !process.env.NODE_ENV || process.env.NODE_ENV === 'development' ?
  DEV_VIEW === DEFAULT_VIEW : first(get(window, ['location', 'host']).split('.')) === DEFAULT_VIEW
