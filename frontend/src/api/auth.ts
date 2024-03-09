import axios from 'axios'
import { makeApi } from './makeApi'

export const authApiEndpoint = process.env.API_URL || 'http://localhost:4000'

export const authHttp = axios.create({
  baseURL: authApiEndpoint,
  withCredentials: true,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
})

const {
  getApi: authGetApi,
  postApi: authPostApi,
  putApi: authPutApi,
  deleteApi: authDeleteApi,
} = makeApi(authHttp)

export { authGetApi, authPostApi, authPutApi, authDeleteApi }
