import axios, { InternalAxiosRequestConfig } from 'axios'
import { makeApi } from './makeApi'

export const apiEndpoint = process.env.API_URL || 'http://localhost:4000'
// export const ordersApiEndpoint = 'http://localhost:4000'

export const httpClient = axios.create({
  baseURL: apiEndpoint,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
})

function onRequest(request: InternalAxiosRequestConfig) {
  const accessToken = localStorage.getItem('accessToken')

  if (accessToken) {
    // request.headers['Authorization'] = `Bearer ${accessToken}`
    request.headers.set('Authorization', `Bearer ${accessToken}`)
  }

  return request
}

function onResponseSuccess(res: any) {
  return res.data
}

// async function onResponseError(error) {
//   const originalRequest = error.config

//   if (error.response.status !== 401) {
//     throw error
//   }

//   try {
//     const { accessToken } = await authService.refresh()

//     accessTokenService.save(accessToken)

//     return httpClient.request(originalRequest)
//   } catch (error) {
//     throw error
//   }
// }

httpClient.interceptors.request.use(onRequest)

const {
  getApi: ordersGetApi,
  postApi: ordersPostApi,
  putApi: ordersPutApi,
  deleteApi: ordersDeleteApi,
} = makeApi(httpClient)

export { ordersGetApi, ordersPostApi, ordersPutApi, ordersDeleteApi }
