import {jwtService} from '../services/jwtService'
import {ApiError} from '../exceptions/ApiError.js'

export const authMiddleware = (req: any, res: any, next: any) => {
  const authorization = req.headers['authorization']

  if (!authorization) {
    throw ApiError.Unauthorized()
  }

  const [, accessToken] = authorization.split(' ')

  if (!accessToken) {
    throw ApiError.Unauthorized()
  }

  const userData = jwtService.verify(accessToken)

  if (!userData) {
    throw ApiError.Unauthorized()
  }

  next()
}
