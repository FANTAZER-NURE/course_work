import { httpClient } from 'api/httpClient'
import { TUser } from '../../../backend/src/types/user'

function getAll() {
  return httpClient('/users' as '/users')
}

export const userService = { getAll }
