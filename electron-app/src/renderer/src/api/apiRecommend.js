import { get } from '../utils/request'

export async function getRecommendData() {
  return get('/recommend/data')
}
