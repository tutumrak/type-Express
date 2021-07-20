import Controller from "src/interfaces/controller.interface";
import {Response, Request, Router, NextFunction} from 'express';
import UserRegDto from "./dtos/registration.dto";
import userModel from "./usersModel";
class UserController implements Controller {

    public path: string = '/users';
    public router = Router();
    constructor() {
        this.initializeRoutes();
    }
    private initializeRoutes(){

    }
    private registration = async (req: Request, res: Response, next: NextFunction) => {
        const regData: UserRegDto = req.body;
        const userExists = await userModel.findOne({email: regData.email});
        if (userExists) {
            next(new )
        }
    }

}