import * as mongoose from 'mongoose';
import Post from './postsInterface';

const postSchema = new mongoose.Schema({
    author: String,
    title: String,
    Content: String,
});

const postModel = mongoose.model<Post & mongoose.Document>('Post', postSchema);

export default postModel;