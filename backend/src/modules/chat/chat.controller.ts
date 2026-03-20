import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  Request,
} from '@nestjs/common';
import { ChatService } from './chat.service';
import { SendMessageDto } from './dto/send-message.dto';

@Controller('messages')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  /**
   * 发送消息
   */
  @Post()
  async sendMessage(
    @Request() req: { user: { id: string } },
    @Body() sendMessageDto: SendMessageDto,
  ) {
    return this.chatService.sendMessage(req.user.id, sendMessageDto);
  }

  /**
   * 获取对话历史
   */
  @Get(':projectId')
  async getMessages(
    @Request() req: { user: { id: string } },
    @Param('projectId') projectId: string,
    @Query('page') page?: string,
    @Query('size') size?: string,
  ) {
    const pageNum = parseInt(page ?? '1', 10);
    const sizeNum = parseInt(size ?? '20', 10);
    return this.chatService.getMessages(
      req.user.id,
      projectId,
      pageNum,
      sizeNum,
    );
  }
}
