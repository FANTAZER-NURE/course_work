import {ApiError} from '../exceptions/ApiError.js'
import {jwtService} from '../services/jwtService.js'

export const authMiddleware = (req: any, res: any, next: any) => {
  const authHeader = req.headers['authorization']

  if (!authHeader) {
    throw ApiError.Unauthorized()
  }

  const [, accessToken] = authHeader.split(' ')

  if (!accessToken) {
    throw ApiError.Unauthorized()
  }

  const userData = jwtService.validateAccessToken(accessToken)

  // if (!userData) {
  //   const { refreshToken } = req.cookies;

  //   const userDataRef = jwtService.validateRefreshToken(refreshToken);
  //   if (!userDataRef) {
  //     throw ApiError.Unauthorized();
  //   }
  // }

  // const decoded = jwtService.verify(token, process.env.JWT_SECRET)
  // req.userId = decoded.userId

  const userDataRef = jwtService.validateAccessToken(accessToken)
  if (!userDataRef) {
    throw ApiError.Unauthorized()
  }

  next()
}
