
import {  Router } from 'express';
import validationMiddleware from '../middleware/validationMiddleware';
import PostDto from '../../dtos/postsDto';
import Controller from '../interfaces/controller.interface';
import authMiddleware from '../middleware/authMiddleware';
const postLogic = require('./post.logic');
class PostsController implements Controller{
    public path: string = '/posts';
    public router: Router = Router();
    constructor() {
        this.initializeRoutes();
    }
    initializeRoutes(){
        this.router.all(`${this.path}/*`, authMiddleware)
        this.router.get(`${this.path}/:id`, postLogic.getPostById);
        this.router.patch(`${this.path}/:id`, validationMiddleware(PostDto, true), postLogic.updatePostById);
        this.router.delete(`${this.path}/:id`, postLogic.deletePost);
        this.router.get(this.path, postLogic.getAllPosts);
        this.router.post(this.path, postLogic.createPost);
    }
}
export default PostsController;