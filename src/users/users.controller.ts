import Controller from "src/interfaces/controller.interface";
import {Response, Request, Router, NextFunction} from 'express';
import UserRegDto from "./dtos/registration.dto";
import userModel from "./usersModel";
import NotFound from "src/exceptions/NotFound";
import bcrypt from 'bcrypt';
import UserLogDto from "./dtos/login.dto";
import HttpException from "src/exceptions/httpException";
import UserI from "./user.interface";
import jwt, { Jwt } from 'jsonwebtoken';
class UserController implements Controller {

    public path: string = '/users';
    public router = Router();
    constructor() {
        this.initializeRoutes();
    }
    private initializeRoutes(){
        this.router.post
    }
    private registration = async (req: Request, res: Response, next: NextFunction) => {
        const regData: UserRegDto = req.body;
        const user = await userModel.findOne({email: regData.email});
        if (user) {
            next(new NotFound('User'));
        }else {
            const passHashed = bcrypt.hash(regData.password, 10);
            const newUser = await userModel.create({
                ...regData,
                password: passHashed
            });
            const jwt: TokenData = this.createToken(newUser);
            const cookie = this.createCookie(jwt);
            res.setHeader('Set-Cookie', [cookie]);
            res.send({
                status: 'Success',
                msg: 'Logged in'
            });
        }
    }
    private login = async (req: Request, res: Response, next: NextFunction) => {
        const logData: UserLogDto = req.body;
        const user = await userModel.findOne({ email: logData.email });
        if (!user) {
            next(new NotFound('User'));
        } else {
            const passwordMatch = await bcrypt.compare(logData.password, user.password);
            if (!passwordMatch) {
                next(new HttpException(400, 'Invalid Password'));
            }else {
                const jwt: TokenData = this.createToken(user);
                const cookie = this.createCookie(jwt);
                res.setHeader('Set-Cookie', [cookie]);
                res.send({
                    status: 'Success',
                    msg: 'Logged in'
                });
            }
        }
    }

    private createToken = (user: UserI): TokenData => {
        const expiresIn: number = 60*60;
        const secret = process.env.JWT_SECRET;
        const dataStoredInToken: DataInToken = {
            subjectId: user._id
        };
        const token = jwt.sign(dataStoredInToken, secret as string, {expiresIn: expiresIn})
        return {
            token, expiresIn
        };
    }
    private createCookie = (tokenData: TokenData) => {
        return `Authorization=${tokenData.token};HttpOnly;Max-Age=${tokenData.expiresIn}`;
    }
}