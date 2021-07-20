import { NextFunction, Response, Request } from 'express';
import jwt from 'jsonwebtoken';
import HttpException from 'src/exceptions/httpException';
import userModel from 'src/users/usersModel';

const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const cookies = req.cookies;
    if (cookies && cookies.Authorization) {
        const secret = process.env.JWT_SECRET;
        try {
            const verification = jwt.verify(cookies.Authorization, secret as string) as DataInToken;
            const id = verification.subjectId;
            const user = await userModel.findById(id);
            if (!user) {
                next(new HttpException(404, 'Authorization failed'));
            }else {
                req.user = user;
                next();
            }
        } catch (error) {
            next(new HttpException(404, 'Authorization failed'));
        }
    }else next(new HttpException(404, 'Authorization failed'));
}