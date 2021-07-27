import { IsString } from 'class-validator'
class PostDto {
    @IsString()
    title: string;
    @IsString()
    content: string;
}export default PostDto;