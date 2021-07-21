import express from 'express';
import mongoose from 'mongoose';
import Controller from './interfaces/controller.interface';
import errorHandler from './middleware/errorhandler';
import cookieParser from 'cookie-parser';
export class App {
    private app: express.Application;
    constructor(port: number, controllers: Controller[]) {
        this.app = express();
        this.connectToDatabase().then(() => console.log(`Succesfully connected to db`)).catch((err) => console.log(err));
        this.listen(port);
        this.initializeMiddleware();
        this.initializeRoutes(controllers);
        this.initializeErrorHandlers();
    }
    initializeMiddleware(){
        this.app.use(express.urlencoded({extended: true}));
        this.app.use(express.json());
        this.app.use(cookieParser())
    }
    initializeErrorHandlers(){
        this.app.use(errorHandler);
    }
    initializeRoutes(controllers: Controller[]){
        controllers.forEach(controller => {
            this.app.use('/', controller.router);
        });
    }
    private connectToDatabase(){
        const {
            MONGO_USER,
            MONGO_PASSWORD,
            MONGO_PATH
        } = process.env;
        return mongoose.connect(
        `mongodb+srv://${MONGO_USER}:${MONGO_PASSWORD}${MONGO_PATH}`, { useUnifiedTopology: true, useNewUrlParser: true })
    }
    public listen(port: number){
        return this.app.listen(port);
    }
    
}