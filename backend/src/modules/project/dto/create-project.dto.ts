import { IsString, MinLength, MaxLength, IsIn } from 'class-validator';

export class CreateProjectDto {
  @IsString()
  @MinLength(2, { message: '项目名称长度至少为2位' })
  @MaxLength(100, { message: '项目名称长度最多为100位' })
  name!: string;

  @IsIn(['餐饮', '零售', 'SaaS', '电商', '教育', '其他'], { message: '行业类型不正确' })
  industry!: string;
}
