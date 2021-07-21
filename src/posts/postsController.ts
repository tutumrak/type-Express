
import { NextFunction, Request, Response, Router } from 'express';
import validationMiddleware from '../middleware/validationMiddleware';
import postModel from './postsModel';
import PostI from './postsInterface';
import PostDto from '../posts/postsDto';
import Controller from '../interfaces/controller.interface';
import NotFound from '../exceptions/NotFound';
import authMiddleware from '../middleware/authMiddleware';
import UserI from 'src/users/user.interface';
class PostsController implements Controller{
    public path: string = '/posts';
    private post = postModel;
    public router: Router = Router();
    constructor() {
        this.initializeRoutes();
    }
    initializeRoutes(){
        this.router.get(this.path, this.getAllPosts);
        this.router.all(`${this.path}/*`, authMiddleware)
        this.router.get(`${this.path}/:id`, this.getPostsById); 
        this.router.post(this.path, validationMiddleware(PostDto), this.createPost);
        this.router.delete(`${this.path}/:id`, this.deletePost);
        this.router.patch(`${this.path}/:id`, validationMiddleware(PostDto, true), this.updatePostById)
        this.router.delete(this.path, this.delAllPosts)
    }
    private createPost = async (req: Request, res: Response, _next: NextFunction) => {
        const postData: PostI = req.body; 
        const ownerId: string = req.user._id;         
        const newPost = await this.post.create({
            ...postData,
            author: ownerId
        });
        res.send(newPost);
    }
    private deletePost = async (req: Request, res: Response, _next: NextFunction) => {
        const userId = req.user._id;
        const postToDelete = await this.post.findById(req.params.id);
        const postAuthorId = postToDelete?.author;
        console.log(userId, postAuthorId);
        if (userId !== postAuthorId) {
            res.send({Status: 'Failed', Reason: 'Not Authorized'});
        }else {
            await this.post.findByIdAndDelete(req.params.id);
        }
    }
    private getAllPosts = (_req: Request, res: Response) => {
        this.post.find()
        .then((posts) => res.send(posts));
    }
    private delAllPosts = (_req: Request, res: Response) => {
        this.post.deleteMany()
        .then(() => res.send(`deleted all posts`))
        .catch((err) => console.log(err));
    }
    private getPostsById = (req: Request, res: Response, next: NextFunction) => {
        const id: string = (req.params.id);
        this.post.findById(id)
            .then((post) => { 
                if (post) res.send(post);
                else next(new NotFound('Post'));
             });
    }
    private updatePostById = (req: Request, res: Response, next: NextFunction) => {
        const id: string = req.params.id;
        const postData: PostI = req.body
        this.post.findByIdAndUpdate(id, postData, {new: true})
            .then((post) => {
                if (post) {
                    res.send(`Post with id of: ${id} has been updated`);
                }else {
                    next(new NotFound('Post'));
                }
            });
    }
}
export default PostsController;