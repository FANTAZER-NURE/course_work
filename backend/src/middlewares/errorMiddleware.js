import {ApiError} from '../exceptions/ApiError.js'

export function errorMiddleware(error, req, res, next) {
  if (error instanceof ApiError) {
    const {status, massage, errors} = error

    res.status(status).send({
      massage,
      errors,
    })

    return
  }

  console.log('here2')

  res.status(500).send({
    massage: 'Error',
  })
}
