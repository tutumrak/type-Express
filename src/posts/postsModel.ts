import * as mongoose from 'mongoose';
import Post from '../interfaces/postsInterface';

const postSchema = new mongoose.Schema({
    author: {
        ref: 'Users',
        type: mongoose.Schema.Types.ObjectId,
    },
    title: String,
    content: String,
});

const postModel = mongoose.model<Post & mongoose.Document>('Post', postSchema);

export default postModel;