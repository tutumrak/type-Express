import "dotenv/config";
import { App } from "./app";
import PostsController from "./posts/postsController";
const app = new App(5000,[new PostsController()]);

