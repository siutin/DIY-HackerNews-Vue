import { formatDistance } from 'date-fns'

export const captialize = (s) => `${s.charAt(0).toUpperCase()}${s.slice(1)}`
export const timeFromNow = (time) => formatDistance(new Date(time * 1000), new Date(), { addSuffix: true })
