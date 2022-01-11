import { NextFunction, Request, Response } from 'express';
import { ParamsDictionary } from 'express-serve-static-core'
import { ParsedQs } from 'qs';

interface WrapperRequestHandler<
  P = ParamsDictionary,
  ResBody = any,
  ReqBody = any,
  ReqQuery = ParsedQs,
  Locals extends Record<string, any> = Record<string, any>
  > {
  (
    req: Request<P, ResBody, ReqBody, ReqQuery, Locals>,
    res: Response<ResBody, Locals>,
    next: NextFunction,
  ): void | Promise<void> | {
    data?: any,
    metadata?: any
  } | Promise<{
    data?: any,
    metadata?: any
  }>;
}

export const routeWrapper = (cb: WrapperRequestHandler) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const handlerResponse = await cb(req, res, next)
      if (handlerResponse) {
        return res.status(200).json({
          data: handlerResponse.data || {},
          metadata: handlerResponse.metadata
        })
      }

      return res.status(200).json()
    } catch (error) {
      next(error)
    }
  }