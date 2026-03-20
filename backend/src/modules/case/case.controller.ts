import { Controller, Get, Param, Query } from '@nestjs/common';
import { CaseService } from './case.service';
import { Public } from '../../common/decorators/public.decorator';

@Controller('cases')
export class CaseController {
  constructor(private readonly caseService: CaseService) {}

  /**
   * 获取案例列表（公开接口）
   */
  @Public()
  @Get()
  async findAll(
    @Query('industry') industry?: string,
    @Query('page') page?: string,
    @Query('size') size?: string,
  ) {
    const pageNum = parseInt(page ?? '1', 10);
    const sizeNum = parseInt(size ?? '10', 10);
    return this.caseService.findAll(industry, pageNum, sizeNum);
  }

  /**
   * 获取案例详情（公开接口）
   */
  @Public()
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.caseService.findOne(id);
  }
}
