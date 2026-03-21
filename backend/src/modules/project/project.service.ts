import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { UserService } from '../user/user.service';
import { CreateProjectDto } from './dto/create-project.dto';

@Injectable()
export class ProjectService {
  constructor(
    private prisma: PrismaService,
    private userService: UserService,
  ) {}

  /**
   * 创建项目
   */
  async create(userId: string, createProjectDto: CreateProjectDto) {
    const project = await this.prisma.project.create({
      data: {
        userId,
        name: createProjectDto.name,
        industry: createProjectDto.industry,
      },
      select: {
        id: true,
        name: true,
        industry: true,
        status: true,
        currentTurn: true,
        directionConfirmed: true,
        riskFlag: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    await this.userService.incrementDailyQuota(userId);

    return project;
  }

  /**
   * 获取用户项目列表
   */
  async findAll(userId: string, page: number = 1, size: number = 10) {
    const skip = (page - 1) * size;

    const [list, total] = await Promise.all([
      this.prisma.project.findMany({
        where: {
          userId,
          deletedAt: null,
        },
        select: {
          id: true,
          name: true,
          industry: true,
          status: true,
          currentTurn: true,
          directionConfirmed: true,
          riskFlag: true,
          createdAt: true,
          updatedAt: true,
        },
        orderBy: {
          updatedAt: 'desc',
        },
        skip,
        take: size,
      }),
      this.prisma.project.count({
        where: {
          userId,
          deletedAt: null,
        },
      }),
    ]);

    return {
      list,
      total,
      page,
      size,
    };
  }

  /**
   * 获取项目详情
   */
  async findOne(userId: string, projectId: string) {
    const project = await this.prisma.project.findFirst({
      where: {
        id: projectId,
        deletedAt: null,
      },
      select: {
        id: true,
        userId: true,
        name: true,
        industry: true,
        status: true,
        currentTurn: true,
        directionConfirmed: true,
        directionConfirmTurn: true,
        riskFlag: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!project) {
      throw new NotFoundException('项目不存在');
    }

    if (project.userId !== userId) {
      throw new ForbiddenException('无权访问该项目');
    }

    return project;
  }

  /**
   * 软删除项目
   */
  async remove(userId: string, projectId: string) {
    const project = await this.findOne(userId, projectId);

    await this.prisma.project.update({
      where: { id: project.id },
      data: { deletedAt: new Date() },
    });

    return { message: '删除成功' };
  }
}
