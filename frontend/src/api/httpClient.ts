import axios, { InternalAxiosRequestConfig } from 'axios'
import { makeApi } from './makeApi'
import { accessTokenService } from 'services/accessTokenService'
import { authService } from 'services/authService'

export const apiEndpoint = process.env.API_URL || 'http://localhost:4000'
// export const ordersApiEndpoint = 'http://localhost:4000'

export const httpClient = axios.create({
  baseURL: apiEndpoint,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
})

httpClient.interceptors.request.use(onRequest)
httpClient.interceptors.response.use(onResponseSuccess, onResponseError)

function onRequest(request: InternalAxiosRequestConfig) {
  const accessToken = localStorage.getItem('accessToken')

  if (accessToken) {
    request.headers.set('Authorization', `Bearer ${accessToken}`)
  }

  return request
}

function onResponseSuccess(res: any) {
  return res
}

async function onResponseError(error: { config: any; response: { status: number } }) {
  const originalRequest = error.config

  if (error.response.status !== 401) {
    throw error
  }

  try {
    const { token } = await authService.refresh()

    accessTokenService.save(token)

    return httpClient.request(originalRequest)
  } catch (error) {
    throw error
  }
}

const { getApi, postApi, putApi, deleteApi } = makeApi(httpClient)

export { getApi, postApi, putApi, deleteApi }
