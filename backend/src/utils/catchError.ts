import {NextFunction, Request, Response} from 'express'

export const catchError =
  <T>(handler: (req: Request, res: Response) => Promise<T> | T) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await handler(req, res)
    } catch (error) {
      next(error)
    }
  }
