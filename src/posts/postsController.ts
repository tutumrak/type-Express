import * as express from 'express';
import postModel from './postsModel';
import Post from './postsInterface';
import Controller from '../interfaces/controller.interface';
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
    }
    createPost = (req: express.Request, res: express.Response) => {
        const postData: Post = req.body;
        const createdPost = new postModel(postData);
        createdPost.save()
        .then((created) => res.send(created))
        .catch((err) => console.log(err));
    }
    deletePost = (req: express.Request, res: express.Response) => {
        const id = req.params.id;
        postModel.findByIdAndDelete(id)
        .then((result) => res.send(200))
        .catch((err) => res.send(404));
    }
    getAllPosts = (req: express.Request, res: express.Response) => {
        postModel.find()
        .then((posts) => res.send(posts));
    }
    getPostById = (req: express.Request, res: express.Response) => {
        const postId = req.params.id;
        postModel.findById(postId)
        .then((result) => res.send(result))
        .catch((err) => res.send(err));
    }
    updatePostById = (req: express.Request, res: express.Response) => {
        const id = req.params.id;
        const postData: Post = req.body
        postModel.findByIdAndUpdate(id, postData, {new: true})
        .then((result) => res.send(result))
        .catch((err) => res.send(err));

    }
}
export default PostsController;