import { IsString, IsNotEmpty, MaxLength, IsOptional } from 'class-validator';

export class UpdateDocumentDto {
  @IsString()
  @IsNotEmpty({ message: '文档内容不能为空' })
  content!: string;

  @IsOptional()
  @IsString()
  @MaxLength(100, { message: '自定义标签长度最多为100位' })
  customLabel?: string;
}
