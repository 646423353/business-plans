import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class CaseService {
  constructor(private prisma: PrismaService) {}

  async findAll(
    industry?: string,
    page: number = 1,
    size: number = 10,
  ) {
    const skip = (page - 1) * size;
    const where: any = {
      isPublished: true,
    };

    if (industry) {
      where.industry = industry;
    }

    const [list, total] = await Promise.all([
      this.prisma.case.findMany({
        where,
        select: {
          id: true,
          title: true,
          industry: true,
          summary: true,
          highlights: true,
          viewCount: true,
          createdAt: true,
        },
        orderBy: {
          viewCount: 'desc',
        },
        skip,
        take: size,
      }),
      this.prisma.case.count({ where }),
    ]);

    const parsedList = list.map((item) => ({
      ...item,
      highlights: this.parseHighlights(item.highlights),
    }));

    return {
      list: parsedList,
      total,
      page,
      size,
    };
  }

  async findOne(id: string) {
    const caseItem = await this.prisma.case.findUnique({
      where: { id },
      select: {
        id: true,
        title: true,
        industry: true,
        summary: true,
        highlights: true,
        businessDesign: true,
        functionDesign: true,
        evaluation: true,
        risk: true,
        viewCount: true,
        createdAt: true,
      },
    });

    if (caseItem) {
      await this.prisma.case.update({
        where: { id },
        data: {
          viewCount: { increment: 1 },
        },
      });
    }

    if (caseItem) {
      return {
        ...caseItem,
        highlights: this.parseHighlights(caseItem.highlights),
      };
    }

    return caseItem;
  }

  private parseHighlights(highlights: string | null): string[] {
    if (!highlights) return [];
    try {
      const parsed = JSON.parse(highlights);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
}
