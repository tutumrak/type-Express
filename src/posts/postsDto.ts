import { IsString } from 'class-validator'
class PostDto {
    @IsString()
    author: string;

    @IsString()
    title: string;

    @IsString()
    content: string;
}export default PostDto;