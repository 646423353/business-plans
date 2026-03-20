import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import { PrismaService } from '../../prisma/prisma.service';
import { SendMessageDto } from './dto/send-message.dto';

@Injectable()
export class ChatService {
  private readonly logger = new Logger(ChatService.name);
  private openai: OpenAI | null = null;

  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {
    const apiKey = this.configService.get<string>('ai.apiKey');
    const baseUrl = this.configService.get<string>('ai.baseUrl');
    
    if (apiKey && apiKey !== 'YOUR_SILICONFLOW_API_KEY') {
      this.openai = new OpenAI({ 
        apiKey,
        baseURL: baseUrl,
      });
    }
  }

  async sendMessage(userId: string, sendMessageDto: SendMessageDto) {
    try {
      const { projectId, content } = sendMessageDto;

      const project = await this.prisma.project.findFirst({
        where: {
          id: projectId,
          userId,
          deletedAt: null,
        },
        select: {
          id: true,
          name: true,
          industry: true,
          currentTurn: true,
          status: true,
          directionConfirmed: true,
        },
      });

      if (!project) {
        throw new Error('项目不存在');
      }

      if (project.status === 'generated') {
        throw new Error('项目已锁定，无法继续对话');
      }

      if (project.currentTurn >= 100) {
        throw new Error('已达到对话上限');
      }

      const userMessage = await this.prisma.message.create({
        data: {
          projectId,
          turn: project.currentTurn + 1,
          role: 'user',
          content,
        },
      });

      let aiResponse: string;
      
      if (this.openai) {
        const history = await this.getConversationHistory(projectId);
        aiResponse = await this.generateAIResponse(
          project,
          content,
          history,
          project.currentTurn + 1,
        );
      } else {
        aiResponse = this.getMockResponse(project, project.currentTurn + 1);
      }

      const aiMessage = await this.prisma.message.create({
        data: {
          projectId,
          turn: project.currentTurn + 1,
          role: 'assistant',
          content: aiResponse,
        },
      });

      const isFirstTurn = project.currentTurn === 0;
      let directionConfirmed = project.directionConfirmed;

      if (isFirstTurn) {
        directionConfirmed = true;
        await this.prisma.project.update({
          where: { id: projectId },
          data: {
            currentTurn: { increment: 1 },
            directionConfirmed: true,
            directionConfirmTurn: 1,
          },
        });
      } else {
        await this.prisma.project.update({
          where: { id: projectId },
          data: { currentTurn: { increment: 1 } },
        });
      }

      return {
        userMessage,
        aiMessage,
        directionConfirmed,
      };
    } catch (error) {
      this.logger.error('AI API error:', error);
      throw error;
    }
  }

  private async getConversationHistory(projectId: string): Promise<{ role: string; content: string }[]> {
    const messages = await this.prisma.message.findMany({
      where: { projectId },
      orderBy: { createdAt: 'asc' },
      select: { role: true, content: true },
      take: 50,
    });

    return messages.map((m: { role: string; content: any; }) => ({
      role: m.role === 'user' ? 'user' : 'assistant',
      content: m.content,
    }));
  }

  private async generateAIResponse(
    project: { id: string; name: string; industry: string; currentTurn: number; directionConfirmed: boolean },
    userContent: string,
    history: { role: string; content: string }[],
    currentTurn: number,
  ): Promise<string> {
    const systemPrompt = this.buildSystemPrompt(project, currentTurn);
    const model = this.configService.get<string>('ai.model') || 'Qwen/Qwen2.5-7B-Instruct';

    const messages: { role: 'system' | 'user' | 'assistant'; content: string }[] = [
      { role: 'system', content: systemPrompt },
      ...history.slice(-20).map((h) => ({
        role: h.role as 'user' | 'assistant',
        content: h.content,
      })),
      { role: 'user', content: userContent },
    ];

    try {
      const response = await this.openai!.chat.completions.create({
        model,
        messages,
        max_tokens: 2000,
        temperature: 0.7,
      });

      return response.choices[0]?.message?.content || '抱歉，我无法生成回复。';
    } catch (error) {
      this.logger.error('AI API error:', error);
      return '抱歉，AI服务暂时不可用，请稍后重试。';
    }
  }

  private getMockResponse(
    project: { name: string; industry: string },
    turn: number,
  ): string {
    const responses = [
      `感谢您分享关于"${project.name}"项目的想法！这是一个${project.industry}领域的有趣项目。

让我确认一下我的理解：
- 项目名称：${project.name}
- 行业领域：${project.industry}

请问您能详细描述一下：
1. 您的目标用户群体是谁？
2. 这个项目解决的核心问题是什么？
3. 您预期的商业模式是怎样的？`,

      `非常好的补充信息！让我继续深入了解：

**关于市场定位：**
- 您的目标市场规模大概是多少？
- 目前市场上有哪些主要竞争对手？

**关于产品服务：**
- 您计划提供哪些核心功能？
- 有什么独特的竞争优势？`,

      `感谢您的详细说明！让我总结一下目前收集到的关键信息：

**项目概况：**
- 项目名称：${project.name}
- 行业：${project.industry}

接下来我想了解：
1. 您的团队背景如何？
2. 预期的启动资金需求？
3. 第一年主要目标是什么？`,
    ];

    return responses[(turn - 1) % responses.length];
  }

  private buildSystemPrompt(
    project: { name: string; industry: string; currentTurn: number; directionConfirmed: boolean },
    turn: number,
  ): string {
    const basePrompt = `你是一位专业的商业策划顾问，正在帮助用户完善一个"${project.industry}"行业的商业项目"${project.name}"。

你的职责是：
1. 引导用户系统化地梳理商业想法
2. 提供专业的商业分析和建议
3. 帮助用户明确商业模式、市场定位、运营策略等关键要素
4. 最终帮助用户生成完整的商业策划文档

回复要求：
- 使用引导式提问，每轮回复包含1-3个引导性问题
- 使用标准商业术语（如商业模式画布、TAM/SAM/SOM、SWOT分析等）
- 建议需具体可执行，避免空泛概念
- 结合最新行业趋势和AI技术进展`;

    if (turn === 1) {
      return `${basePrompt}

这是第一轮对话，用户刚描述了他们的创业想法。请：
1. 复述你对用户想法的理解
2. 提出确认问题，明确项目方向
3. 询问用户是否有需要修正或补充的地方`;
    }

    if (turn >= 80 && turn < 95) {
      return `${basePrompt}

注意：当前是第${turn}轮对话，接近100轮上限。请引导用户：
1. 总结已讨论的关键内容
2. 确认是否有遗漏的重要信息
3. 准备进入文档生成阶段`;
    }

    if (turn >= 95) {
      return `${basePrompt}

注意：当前是第${turn}轮对话，即将达到上限。请：
1. 做最后的确认和补充
2. 告知用户即将生成文档
3. 确保所有关键信息都已收集`;
    }

    return basePrompt;
  }

  async getMessages(userId: string, projectId: string, page: number = 1, size: number = 100) {
    const project = await this.prisma.project.findFirst({
      where: {
        id: projectId,
        userId,
        deletedAt: null,
      },
    });

    if (!project) {
      throw new Error('项目不存在');
    }

    const total = await this.prisma.message.count({
      where: { projectId },
    });

    const list = await this.prisma.message.findMany({
      where: { projectId },
      orderBy: { createdAt: 'asc' },
      take: 200,
    });

    return {
      list,
      total,
      page: 1,
      size: total,
    };
  }
}
