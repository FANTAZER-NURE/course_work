import { jwtService } from '../services/jwtService'
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


  // if (!userData) {
  //   const { refreshToken } = req.cookies;

  //   const userDataRef = jwtService.validateRefreshToken(refreshToken);
  //   if (!userDataRef) {
  //     throw ApiError.Unauthorized();
  //   }
  // }

  // const decoded = jwtService.verify(token, process.env.JWT_SECRET)
  // req.userId = decoded.userId

  // const userDataRef = jwtService.validateAccessToken(accessToken)
  // if (!userDataRef) {
  //   throw ApiError.Unauthorized()
  // }

  next()
}
