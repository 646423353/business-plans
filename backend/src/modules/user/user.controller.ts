import { Controller, Get, Request } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  /**
   * 获取当前用户信息
   */
  @Get('me')
  async getCurrentUser(@Request() req: { user: { id: string } }) {
    return this.userService.findById(req.user.id);
  }
}
