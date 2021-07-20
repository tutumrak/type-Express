import { Request, Response, NextFunction, RequestHandler } from 'express';
import { validate, ValidationError } from 'class-validator';
import HttpException from '../exceptions/httpException';
import { plainToClass } from 'class-transformer';

function validationMiddleware<_T>(type:any, skipMissingProperties = false): RequestHandler {
    return (req: Request, _res: Response, next: NextFunction) => {
        validate(plainToClass(type, req.body), { skipMissingProperties })
        .then((errors: ValidationError[]) => {
            if (errors.length > 0) {
                const message: string = errors.map((error: ValidationError) => Object.values(!error.constraints)).join('');
                next(new HttpException(400, message));
            }else next();
        });
    }
}export default validationMiddleware;