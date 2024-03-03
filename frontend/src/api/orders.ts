import axios from 'axios'
import { makeApi } from './makeApi'

export const ordersApiEndpoint = process.env.API_URL || 'http://localhost:4000'
// export const ordersApiEndpoint = 'http://localhost:4000'

export const ordersHttp = axios.create({
  baseURL: ordersApiEndpoint,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
})

const {
  getApi: ordersGetApi,
  postApi: ordersPostApi,
  putApi: ordersPutApi,
  deleteApi: ordersDeleteApi,
} = makeApi(ordersHttp)

export { ordersGetApi, ordersPostApi, ordersPutApi, ordersDeleteApi }
