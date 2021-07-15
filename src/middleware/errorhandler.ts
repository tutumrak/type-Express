import HttpException from "../exceptions/httpException";
import {Request, Response, NextFunction } from 'express';
function errorHandler(error: HttpException, _req: Request, res: Response, _next: NextFunction) {
    const status: number = error.status || 500;
    const message: string = error.message || 'Oops, something went wrong';
    res.status(status).send({status, message});
} export default errorHandler;