import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

const client = axios.create({
  baseURL: API_URL,
  timeout: 25000,
  headers: { 'Content-Type': 'application/json' },
})

function extractErrorMessage(error) {
  if (error.code === 'ECONNABORTED') {
    return 'The request took too long to respond. Please try again.'
  }
  if (!error.response) {
    return 'Cannot reach the server. Check your internet connection.'
  }
  return error.response.data?.error || 'Something went wrong. Please try again.'
}

export async function classifyItem(item) {
  try {
    const { data } = await client.post('/api/classify', { item })
    return data
  } catch (error) {
    throw new Error(extractErrorMessage(error))
  }
}

export async function fetchHistory() {
  try {
    const { data } = await client.get('/api/history')
    return data
  } catch (error) {
    throw new Error(extractErrorMessage(error))
  }
}

export async function deleteHistoryItem(id) {
  try {
    const { data } = await client.delete(`/api/history/${id}`)
    return data
  } catch (error) {
    throw new Error(extractErrorMessage(error))
  }
}

export async function fetchAnalytics() {
  try {
    const { data } = await client.get('/api/analytics')
    return data
  } catch (error) {
    throw new Error(extractErrorMessage(error))
  }
}

export async function fetchCenters() {
  try {
    const { data } = await client.get('/api/centers')
    return data
  } catch (error) {
    throw new Error(extractErrorMessage(error))
  }
}

export default client
