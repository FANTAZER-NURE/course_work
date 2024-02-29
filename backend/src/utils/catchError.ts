// export function catchError(action: (req: any, res: any, next?: any) => Promise<void>) {
//   return async (req: any, res: any, next: any) => {
//     try {
//       await action(req, res, next)
//     } catch (error) {
//       next(error)
//     }
//   }
// }

export function catchError<T>(
  action: (req: Request, res: Response, next?: Function) => Promise<T>
): (req: Request, res: Response, next: Function) => Promise<void> {
  return async (req: Request, res: Response, next: Function) => {
    try {
      await action(req, res, next)
    } catch (error) {
      next(error)
    }
  }
}
