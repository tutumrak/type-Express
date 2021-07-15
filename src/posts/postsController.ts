import express from 'express';
import { NextFunction } from 'express';
import validationMiddleware from '../middleware/validationMiddleware';
import postModel from './postsModel';
import PostI from '../interfaces/postsInterface';
import PostDto from '../posts/postsDto';
import Controller from '../interfaces/controller.interface';
import PostNotFound from '../exceptions/postNotFound';
class PostsController implements Controller{
    public path: string = '/posts';
    private post = postModel;
    public router: express.IRouter = express.Router();
    constructor() {
        this.initializeRoutes();
    }
    initializeRoutes(){
        this.router.post(this.path, validationMiddleware(PostDto), this.createPost);
        this.router.delete(`${this.path}/:id`, this.deletePost);
        this.router.patch(`${this.path}/:id`, validationMiddleware(PostDto, true), this.updatePostById)
        this.router.get(this.path, this.getAllPosts);
        this.router.get(`${this.path}/:id`, this.getPostById);
        this.router.delete(this.path, this.delAllPosts)
    }
    private createPost = (req: express.Request, res: express.Response, _next: NextFunction) => {
        const postData: PostI = req.body;
        console.log(req.body);
        console.log(req.params.id);
        
        const newPost = new this.post(postData);
        newPost.save()
        .then(() => res.send(req.body))
        .catch((err) => console.log(err));
    }
    private deletePost = (req: express.Request, res: express.Response, next: NextFunction) => {
        const id = req.params.id;
        this.post.findByIdAndDelete(id)
        .then((post) => { 
            if (post) res.send(`Post with id of ${id} has been deleted.`)
            else next(new PostNotFound(id));
         });
    }
    private getAllPosts = (_req: express.Request, res: express.Response) => {
        this.post.find()
        .then((posts) => res.send(posts));
    }
    private delAllPosts = (_req: express.Request, res: express.Response) => {
        this.post.deleteMany()
        .then(() => res.send(`deleted all posts`))
        .catch((err) => console.log(err));
    }
    private getPostById = (req: express.Request, res: express.Response, next: NextFunction) => {
        const id: string = (req.params.id);
        this.post.findById(id)
            .then((post) => { 
                if (post) res.send(post);
                else next(new PostNotFound(id));
             });
    }
    private updatePostById = (req: express.Request, res: express.Response, next: NextFunction) => {
        const id: string = req.params.id;
        const postData: PostI = req.body
        this.post.findByIdAndUpdate(id, postData, {new: true})
            .then((post) => {
                if (post) {
                    res.send(`Post with id of: ${id} has been updated`);
                }else {
                    next(new PostNotFound(id));
                }
            });

    }
}
export default PostsController;