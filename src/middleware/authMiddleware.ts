import { NextFunction, Response, Request } from 'express';
import jwt from 'jsonwebtoken';
import HttpException from '../exceptions/httpException';
import userModel from '../users/usersModel';
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
            next(new HttpException(404, 'Authorization failed'));
        }
    }else next(new HttpException(404, 'Authorization failed'));
}export default authMiddleware;