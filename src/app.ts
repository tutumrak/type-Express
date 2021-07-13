import * as express from 'express';
import * as mongoose from 'mongoose';
import Controller from './interfaces/controller.interface';
import errorHandler from './middleware/errorhandler';
export class App {
    private port: number;
    private app: express.Application;
    constructor(port: number, controllers: Controller[]) {
        this.port = port;
        this.app = express();
        this.connectToDatabase()
            .then(() => this.app.listen(this.port, () => `app listening on port ${this.port}`))
            .catch((err) => console.log(err));
        this.initializeRoutes(controllers);
        this.initializeMiddlewares();
    }
    initializeMiddlewares(){
        this.app.use(express.urlencoded({extended: true}));
        this.app.use(express.json());
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
    
}