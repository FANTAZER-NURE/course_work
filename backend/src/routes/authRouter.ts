import {Router} from 'express'
import {catchError} from '../utils/catchError'
import {body} from 'express-validator'
import {authController} from '../controllers/authController'

const authRouter = Router()

authRouter.post(
  '/register',
  // body('email').isEmail(),
  // body('password').isLength({min: 6}),
  catchError(authController.registration)
)

authRouter.post('/login', catchError(authController.login))
authRouter.get('/activate/:activationToken', catchError(authController.activation))

export default authRouter
