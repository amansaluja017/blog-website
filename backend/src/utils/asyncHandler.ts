import { NextFunction, Request, Response } from "express";

const asyncHandler = (handler: (req: Request, res: Response, next: NextFunction) => ReturnType<any>) => async (req: Request, res: Response, next: NextFunction) => {
    try {
        await handler(req, res, next);
    } catch (error) {
        next(error);
    }
}

export { asyncHandler }