import HttpException from "../exceptions/httpException";
import {Request, Response, NextFunction} from 'express';
function errorHandler(err: HttpException, req: Request, res: Response, next: NextFunction) {
    const status: number = err.status;
    const msg: string = err.message;
    res.status(err.status).send({status, msg});
}export default errorHandler;