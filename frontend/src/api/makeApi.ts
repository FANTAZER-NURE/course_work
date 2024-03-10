import * as Params from './params'
import * as Endpoints from './endpoints'
import { AxiosInstance } from 'axios'

export { Endpoints, Params }

export const makeApi = (axiosInstance: AxiosInstance) => {
  return {
    getApi: makeGetApi(axiosInstance),
    postApi: makePostApi(axiosInstance),
    putApi: makePutApi(axiosInstance),
    deleteApi: makeDeleteApi(axiosInstance),
  }
}

const makeGetApi = (axiosInstance: AxiosInstance) => {
  return async function getApi<T extends keyof Endpoints.GET>(
    url: T,
    params?: Endpoints.GET[T]['params'],
    config?: {
      headers?: any
    }
  ): Promise<Endpoints.GET[T]['result']> {
    const response = await axiosInstance.get(url, {
      params,
      headers: config?.headers,
    })
    console.log('url', url)
    console.log('response', response)
    return response.data
  }
}

const makePostApi = (axiosInstance: AxiosInstance) => {
  return async function postApi<T extends keyof Endpoints.POST>(
    url: T,
    params?: Endpoints.POST[T]['params'],
    config?: {
      headers?: any
      timeout?: number
    }
  ): Promise<Endpoints.POST[T]['result']> {
    const result = await axiosInstance.post(url, params, {
      headers: config?.headers,
      timeout: config?.timeout,
    })
    return result.data
  }
}

const makePutApi = (axiosInstance: AxiosInstance) => {
  return async function putApi<T extends keyof Endpoints.PUT>(
    url: T,
    params: Endpoints.PUT[T]['params']
  ): Promise<Endpoints.PUT[T]['result']> {
    const result = await axiosInstance.put(url, params)
    return result.data
  }
}

const makeDeleteApi = (axiosInstance: AxiosInstance) => {
  return async function putApi<T extends keyof Endpoints.DELETE>(
    url: T,
    params?: Endpoints.DELETE[T]['params']
  ): Promise<Endpoints.DELETE[T]['result']> {
    const result = await axiosInstance.delete(url, {
      params,
    })
    return result.data
  }
}
