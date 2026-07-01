import { get } from '../utils/request'

export async function getCharts() {
  return get('/charts')
}
