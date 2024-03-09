import axios, { InternalAxiosRequestConfig } from 'axios'
import { makeApi } from './makeApi'

export const authApiEndpoint = process.env.API_URL || 'http://localhost:4000'

export const authHttp = axios.create({
  baseURL: authApiEndpoint,
  withCredentials: true,
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

authHttp.interceptors.request.use(onRequest)

const {
  getApi: authGetApi,
  postApi: authPostApi,
  putApi: authPutApi,
  deleteApi: authDeleteApi,
} = makeApi(authHttp)

export { authGetApi, authPostApi, authPutApi, authDeleteApi }
