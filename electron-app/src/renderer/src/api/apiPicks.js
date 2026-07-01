import { get } from '../utils/request'

export async function getPicksData() {
  return get('/picks/data')
}
