import UserI from "../../src/interfaces/user.interface"

declare global {
    namespace Express {
        interface Request {
            user: UserI;
        }
    }
}