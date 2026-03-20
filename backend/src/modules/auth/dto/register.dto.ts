import { IsEmail, IsString, MinLength, MaxLength, IsOptional } from 'class-validator';

export class RegisterDto {
  @IsEmail({}, { message: '邮箱格式不正确' })
  email!: string;

  @IsString()
  @MinLength(6, { message: '密码长度至少为6位' })
  @MaxLength(20, { message: '密码长度最多为20位' })
  password!: string;

  @IsString()
  @MinLength(2, { message: '用户名长度至少为2位' })
  @MaxLength(50, { message: '用户名长度最多为50位' })
  username!: string;

  @IsOptional()
  @IsString()
  @MaxLength(20, { message: '手机号长度最多为20位' })
  phone?: string;
}
