import "dotenv/config";
import { App } from "./app";
import PostsController from "./posts/postsController";
import UserController from "./users/users.controller";
const app = new App(5001, [new PostsController(), new UserController()]);

