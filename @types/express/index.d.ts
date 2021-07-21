import UserI from "../../src/users/user.interface"

declare global {
    namespace Express {
        interface Request {
            user: UserI;
        }
    }
}