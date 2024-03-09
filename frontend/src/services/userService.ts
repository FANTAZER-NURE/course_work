import { getApi, httpClient } from 'api/httpClient'
import { TUser } from '../../../backend/src/types/user'

function getAll() {
  return getApi('/users' as '/users')
}

export const userService = { getAll }
