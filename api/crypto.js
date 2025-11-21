import axios from 'axios'

const API = axios.create({
  baseURL: 'https://api.coingecko.com/api/v3'
})

/**
 * Fetch markets data from CoinGecko
 * @param {Object} options - { vs_currency, per_page, page, order }
 */
export async function fetchCoins(options = {}){
  const params = {
    vs_currency: options.vs_currency || 'usd',
    order: options.order || 'market_cap_desc',
    per_page: options.per_page || 50,
    page: options.page || 1,
    // include small sparkline array (7d) to avoid extra per-coin requests
    sparkline: options.sparkline !== undefined ? options.sparkline : true,
    price_change_percentage: '24h'
  }

  try{
    const res = await API.get('/coins/markets', { params })
    return res.data
  }catch(err){
    const message = err.response?.data?.error || err.message || 'Request failed'
    throw new Error(message)
  }
}

/**
 * Fetch specific coins by ids (comma-separated array) using markets endpoint
 * @param {Array<string>} ids - array of coin ids (e.g. ['bitcoin','ethereum'])
 * @param {Object} options - other query options
 */
export async function fetchCoinsByIds(ids = [], options = {}){
  if(!ids || !ids.length) return []
  const params = {
    vs_currency: options.vs_currency || 'usd',
    ids: ids.join(','),
    order: options.order || 'market_cap_desc',
    per_page: ids.length,
    page: 1,
    sparkline: options.sparkline !== undefined ? options.sparkline : true,
    price_change_percentage: '24h'
  }
  try{
    const res = await API.get('/coins/markets', { params })
    return res.data
  }catch(err){
    const message = err.response?.data?.error || err.message || 'Request failed'
    throw new Error(message)
  }
}

/**
 * Fetch market chart data for a coin (prices over time)
 * @param {string} id - coin id (e.g. 'bitcoin')
 * @param {number} days - number of days (1 for 24h)
 */
// Simple in-memory cache for chart responses to avoid duplicate network calls during a session
const chartCache = new Map()

export async function fetchCoinChart(id, days = 1, vs_currency = 'usd'){
  const key = `${id}_${days}_${vs_currency}`
  if(chartCache.has(key)){
    return chartCache.get(key)
  }

  try{
    const res = await API.get(`/coins/${id}/market_chart`, { params: { vs_currency, days } })
    // res.data.prices is [[timestamp, price], ...]
    const prices = (res.data.prices || []).map(([t, p]) => ({ time: t, price: p }))
    chartCache.set(key, prices)
    return prices
  }catch(err){
    const status = err.response?.status
    const statusText = err.response?.statusText
    const serverMsg = err.response?.data || null
    const message = err.message || 'Request failed'
    const full = status ? `${message} (status ${status} ${statusText})` : message
    const e = new Error(full)
    e.status = status
    e.serverMessage = serverMsg
    throw e
  }
}

export function clearChartCache(){
  chartCache.clear()
}

export function clearChartCacheKey(id, days = 1, vs_currency = 'usd'){
  const key = `${id}_${days}_${vs_currency}`
  chartCache.delete(key)
}
