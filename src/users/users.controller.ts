import Controller from "src/interfaces/controller.interface";
import { Router } from 'express';
import UserRegDto from "../../dtos/registration.dto";
const userLogic = require('./userLogic');
import UserLogDto from "../../dtos/login.dto";

import validationMiddleware from "../middleware/validationMiddleware";

class UserController implements Controller {

    public path: string = '/users';
    public router = Router();
    constructor() {
        this.initializeRoutes();
    }
    private initializeRoutes(){
        this.router.post(`${this.path}/register`, validationMiddleware(UserRegDto), userLogic.registration);
        this.router.post(`${this.path}/login`, validationMiddleware(UserLogDto), userLogic.login);
        this.router.get(this.path, userLogic.getAll);
        this.router.get(`${this.path}/:id`, userLogic.getById);
    }
    
}export default UserController;