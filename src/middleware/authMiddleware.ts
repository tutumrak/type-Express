import userModel from '../users/user.model';
import { NextFunction, Response, Request } from 'express';
import jwt from 'jsonwebtoken';
import HttpException from '../exceptions/httpException';
import DataInToken from '../interfaces/dataintoken.interface';
async function authMiddleware (req: Request, _res: Response, next: NextFunction) {
    const cookies = req.cookies;
    console.log(req.cookies);
    
    if (cookies && cookies.Authorization) {
        const secret = process.env.JWT_SECRET;
        try {
            const verification = jwt.verify(cookies.Authorization, secret as string) as DataInToken;
            const id = verification.subjectId;
            console.log(`user id ${id}`);
            const user = await userModel.findById(id);
            if (!user) {
                next(new HttpException(404, 'Authorization failed'));
            }else {
                req.user = user;
                console.log(`Passing the user object to next function`)
                next();
            }
        } catch (error) {
            next(new HttpException(404, error));
        }
    }else next(new HttpException(404, 'No authorization field failed'));
}export default authMiddleware;