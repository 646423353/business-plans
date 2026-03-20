import { IsString, IsNotEmpty, MinLength, MaxLength } from 'class-validator';

export class SendMessageDto {
  @IsString()
  @IsNotEmpty({ message: '项目ID不能为空' })
  projectId!: string;

  @IsString()
  @IsNotEmpty({ message: '消息内容不能为空' })
  @MinLength(1, { message: '消息内容长度至少为1位' })
  @MaxLength(2000, { message: '消息内容长度最多为2000位' })
  content!: string;
}
