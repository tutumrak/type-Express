import HttpException from "./httpException";

class NotFound extends HttpException{
    constructor(subject: string) {
        super(404, `${subject}  not found`);
    }
}export default NotFound;