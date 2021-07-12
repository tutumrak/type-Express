import * as express from 'express';
import * as mongoose from 'mongoose';
import Controller from './interfaces/controller.interface';
export class App {
    private port: number;
    private app: express.Application;
    constructor(port: number, controllers: Controller[]) {
        this.port = port;
        this.app = express();
        this.connectToDatabase().then(() => this.app.listen(this.port))
                                .catch((err) => console.log(err));
        this.initializeMiddlewares();
        this.initializeRoutes(controllers);
    }
    initializeMiddlewares(){
        this.app.use(express.urlencoded({extended: true}));
        this.app.use(express.json());
    }
    initializeRoutes(controllers: Controller[]){
        controllers.forEach(controller => {
            this.app.use('/', controller.router);
        });
    }
    public listen(){
        this.app.listen(this.port, () => {
            console.log(`App listening on port ${this.port}`);
        });
    }
    private connectToDatabase(){
        const {
            MONGO_USER,
            MONGO_PASSWORD,
            MONGO_PATH
        } = process.env;
        return mongoose.connect(
            `mongodb+srv://${MONGO_USER}:${MONGO_PASSWORD}${MONGO_PATH}`);
        
    }

}