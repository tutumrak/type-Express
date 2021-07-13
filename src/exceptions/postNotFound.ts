import HttpException from "./httpException";

class PostNotFound extends HttpException {
    
    constructor(id: string) {
        super(404, `Post with ${id} not found`);
        
    }
}export default PostNotFound;