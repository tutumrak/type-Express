import { Response, Request, NextFunction } from 'express';
import UserRegDto from "../../dtos/registration.dto";
import NotFound from "../exceptions/NotFound";
import bcrypt from 'bcrypt';
import UserLogDto from "../../dtos/login.dto";
import HttpException from "../exceptions/httpException";
import jwt from 'jsonwebtoken';
import DataInToken from "src/interfaces/dataintoken.interface";
import TokenData from "src/interfaces/tokendata.interface";
import UserI from "../interfaces/user.interface";
import userModel from './user.model';

const registration = async (req: Request, res: Response, next: NextFunction) => {
        const regData: UserRegDto = req.body;
        const user = await userModel.findOne({email: regData.email});
        if (user) {
            next(new HttpException(400, 'User exists'));
        }else {
            const passHashed = await bcrypt.hash(regData.password, 10);
            const newUser = await userModel.create({
                ...regData,
                password: passHashed
            });
            const jwt: TokenData = createToken(newUser);
            res.setHeader('Set-Cookie', [createCookie(jwt)]);
            res.send({
                status: 'Success',
                msg: 'Logged in'
            });
        }
    }
    const login = async (req: Request, res: Response, next: NextFunction) => {
        const logData: UserLogDto = req.body;
        const user = await userModel.findOne({ email: logData.email });
        if (!user) {
            next(new NotFound('User'));
        } else {
            const passwordMatch = await bcrypt.compare(logData.password, user.password);
            if (!passwordMatch) {
                next(new HttpException(400, 'Invalid Password'));
            }else {
                const jwt: TokenData = createToken(user);
                const cookie = createCookie(jwt);
                res.setHeader('Set-Cookie', [cookie]);
                res.send({
                    status: 'Success',
                    msg: 'Logged in'
                });
            }
        }
    }
    const getAll = async (_req: Request, res: Response, _next: NextFunction) => {
        const users = await userModel.find();
        res.send(users);
    }
    const getById = async (req: Request, res: Response, _next: NextFunction) => {
        const userId = req.params.id;
        const user = await userModel.findById(userId);
        res.send(user);
    }

    const createToken = (user: UserI): TokenData => {
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
    const createCookie = (tokenData: TokenData) => {
        return `Authorization=${tokenData.token};HttpOnly;Max-Age=${tokenData.expiresIn}`;
    }
    module.exports = {createCookie, createToken, getAll, login, registration, getById};
