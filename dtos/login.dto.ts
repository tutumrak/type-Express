import {IsString} from 'class-validator';
class UserLogDto {

    @IsString()
    email: string;

    @IsString()
    password: string;
} export default UserLogDto;