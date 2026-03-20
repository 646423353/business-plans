import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Query,
  Request,
} from '@nestjs/common';
import { ProjectService } from './project.service';
import { CreateProjectDto } from './dto/create-project.dto';

@Controller('projects')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  /**
   * 创建项目
   */
  @Post()
  async create(
    @Request() req: { user: { id: string } },
    @Body() createProjectDto: CreateProjectDto,
  ) {
    return this.projectService.create(req.user.id, createProjectDto);
  }

  /**
   * 获取项目列表
   */
  @Get()
  async findAll(
    @Request() req: { user: { id: string } },
    @Query('page') page?: string,
    @Query('size') size?: string,
  ) {
    const pageNum = parseInt(page ?? '1', 10);
    const sizeNum = parseInt(size ?? '10', 10);
    return this.projectService.findAll(req.user.id, pageNum, sizeNum);
  }

  /**
   * 获取项目详情
   */
  @Get(':id')
  async findOne(
    @Request() req: { user: { id: string } },
    @Param('id') id: string,
  ) {
    return this.projectService.findOne(req.user.id, id);
  }

  /**
   * 删除项目
   */
  @Delete(':id')
  async remove(
    @Request() req: { user: { id: string } },
    @Param('id') id: string,
  ) {
    return this.projectService.remove(req.user.id, id);
  }
}
