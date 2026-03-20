import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  /**
   * 根据ID获取用户信息
   */
  async findById(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        username: true,
        avatar: true,
        role: true,
        quotaDailyUsed: true,
        quotaDailyResetDate: true,
        createdAt: true,
        lastLoginAt: true,
      },
    });

    if (!user) {
      throw new NotFoundException('用户不存在');
    }

    return user;
  }

  /**
   * 检查并重置每日配额
   */
  async checkAndResetDailyQuota(userId: string): Promise<number> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        quotaDailyUsed: true,
        quotaDailyResetDate: true,
      },
    });

    if (!user) {
      return 0;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // 如果重置日期不是今天，则重置配额
    if (!user.quotaDailyResetDate || user.quotaDailyResetDate < today) {
      await this.prisma.user.update({
        where: { id: userId },
        data: {
          quotaDailyUsed: 0,
          quotaDailyResetDate: today,
        },
      });
      return 0;
    }

    return user.quotaDailyUsed;
  }

  /**
   * 增加每日使用配额
   */
  async incrementDailyQuota(userId: string): Promise<number> {
    const user = await this.prisma.user.update({
      where: { id: userId },
      data: {
        quotaDailyUsed: { increment: 1 },
      },
      select: {
        quotaDailyUsed: true,
      },
    });

    return user.quotaDailyUsed;
  }
}
