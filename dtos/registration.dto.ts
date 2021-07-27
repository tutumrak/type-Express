import {IsString} from 'class-validator';
class UserRegDto {
    @IsString()
    userName: string;
    @IsString()
    email: string;
    @IsString()
    password: string;
}export default UserRegDto;