import axios from 'axios'
import { makeApi } from './makeApi'

// export const taggingEditorApiEndpoint = process.env.API_URL || ''
export const ordersApiEndpoint = 'http://localhost:4000'

export const taggingEditorHttp = axios.create({
  baseURL: ordersApiEndpoint,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
})

const {
  getApi: ordersGetApi,
  postApi: ordersPostApi,
  putApi: ordersPutApi,
  deleteApi: ordersDeleteApi,
} = makeApi(taggingEditorHttp)

export { ordersGetApi, ordersPostApi, ordersPutApi, ordersDeleteApi }
