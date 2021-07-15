import * as express from 'express';
import { NextFunction } from 'express';
import postModel from './postsModel';
import Post from './postsInterface';
import Controller from '../interfaces/controller.interface';
import HttpException from '../exceptions/httpException';
import PostNotFound from '../exceptions/postNotFound';
class PostsController implements Controller {
    public path: string = '/posts';
    public router: express.IRouter = express.Router();
    constructor() {
        this.initializeRoutes();
    }
    initializeRoutes(){
        this.router.post(this.path, this.createPost);
        this.router.delete(`${this.path}/:id`, this.deletePost);
        this.router.patch(`${this.path}/:id`,this.updatePostById)
        this.router.get(this.path, this.getAllPosts);
        this.router.get(`${this.path}/:id`, this.getPostById);
        this.router.delete(this.path, this.delAllPosts)
    }
    private createPost = (req: express.Request, res: express.Response) => {
        const postData: Post = req.body;
        const createdPost = new postModel(postData);
        createdPost.save()
        .then((created) => res.send(created))
        .catch((err) => console.log(err));
    }
    private deletePost = (req: express.Request, res: express.Response, next: NextFunction) => {
        const id = req.params.id;
        postModel.findByIdAndDelete(id)
        .then((post) =>{
            if (post) res.send(`Post with ${id} has been deleted`)
            else next(new PostNotFound(id));
        });
    }
    private getAllPosts = (req: express.Request, res: express.Response) => {
        postModel.find()
        .then((posts) => res.send(posts));
    }
    private delAllPosts = (req: express.Request, res: express.Response) => {
        postModel.deleteMany()
        .then(() => res.send(`deleted all posts`))
        .catch((err) => console.log(err));
    }
    private getPostById = (req: express.Request, res: express.Response, next: NextFunction) => {
        const id: string = (req.params.id);
        postModel.findById(id)
            .then((post) => {
                if (post) res.send(`Post with ${id} has been deleted`)
                else next(new PostNotFound(id));
            });
    }
    private updatePostById = (req: express.Request, res: express.Response, next: NextFunction) => {
        const id: string = req.params.id;
        const postData: Post = req.body
        postModel.findByIdAndUpdate(id, postData, {new: true})
            .then((post) => {
                if (post) res.send(`Post with ${id} has been deleted`)
                else next(new PostNotFound(id));
            });

    }
}
export default PostsController;