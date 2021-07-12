import "dotenv/config";
import * as express from 'express';
import * as mongoose  from 'mongoose';
import { App } from "./app";
import PostsController from "./posts/postsController";
const app = new App(5000,[new PostsController()]);

