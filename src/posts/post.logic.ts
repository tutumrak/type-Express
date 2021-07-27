import { NextFunction, Request, Response } from 'express';
import PostI from '../interfaces/postsInterface';
import NotFound from '../exceptions/NotFound';
import postModel from './postsModel';
import HttpException from '../exceptions/httpException';
import PostDto from 'dtos/postsDto';
    const createPost = async (req: Request, res: Response, _next: NextFunction) => {
        const postData: PostI = req.body;
        const ownerId: string = req.user._id;
        const newPost = await postModel.create({
            ...postData,
            author: ownerId
        });
        res.send(newPost);
}
    const deletePost = async (req: Request, res: Response, next: NextFunction) => {
        const postToDelete = await postModel.findById(req.params.id);
        if (!postToDelete) {
            next(new HttpException(400, 'There is no post with that id'));
        } else {
            const userId = req.user._id;
            console.log(userId);
            
            const postAuthorId = postToDelete?.author;
            
            console.log(userId, postAuthorId);
            if (userId.toString() != postAuthorId.toString()) {
                next(new HttpException(400, 'You are not the owner'));
            } else {
                await postModel.findByIdAndDelete(req.params.id);
                res.send({ Status: 'Success', Reason: 'You are the owner' })
            }
        }
        
}
    const getAllPosts = (_req: Request, res: Response) => {
    postModel.find()
        .then((posts) => res.send(posts));
}
    const getPostById = (req: Request, res: Response, next: NextFunction) => {
        const id: string = (req.params.id);
        postModel.findById(id)
        .then((post) => {
            if (post) res.send(post);
            else next(new NotFound('Post'));
        });
}
    const updatePostById = async (req: Request, res: Response, next: NextFunction) => {
        const PostId: string = req.params.id;
        const post = await postModel.findById(PostId);
        if (!post) {
            next(new NotFound('Post'));
        } else {
            const userId = req.user._id;
            const postAuthorId = post.author;
            if (userId === postAuthorId) {
                const postData: PostDto = req.body;
                await post.update(postData, {new: true});
                res.send(post);
            } else next(new HttpException(400, `You are not the owner`));
        }      
}
module.exports = {createPost, getAllPosts, getPostById, updatePostById, deletePost};