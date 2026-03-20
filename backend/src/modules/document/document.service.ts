import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import { PrismaService } from '../../prisma/prisma.service';
import { UpdateDocumentDto } from './dto/update-document.dto';

@Injectable()
export class DocumentService {
  private readonly logger = new Logger(DocumentService.name);
  private openai: OpenAI | null = null;

  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {
    const apiKey = this.configService.get<string>('kimi.apiKey');
    const baseUrl = this.configService.get<string>('kimi.baseUrl');
    
    if (apiKey && apiKey !== 'your-kimi-api-key') {
      this.openai = new OpenAI({ 
        apiKey,
        baseURL: baseUrl,
      });
    }
  }

  async generateDocuments(userId: string, projectId: string) {
    const project = await this.prisma.project.findFirst({
      where: {
        id: projectId,
        userId,
        deletedAt: null,
      },
      include: {
        messages: {
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    if (!project) {
      throw new Error('项目不存在');
    }

    const conversationContent = project.messages
      .map((m) => `${m.role === 'user' ? '用户' : 'AI'}: ${m.content}`)
      .join('\n\n');

    let documents;

    if (this.openai) {
      documents = await Promise.all([
        this.generateBusinessDesign(project, conversationContent),
        this.generateFunctionDesign(project, conversationContent),
        this.generateEvaluation(project, conversationContent),
        this.generateRisk(project, conversationContent),
      ]);
    } else {
      documents = await this.generateMockDocuments(project);
    }

    await this.prisma.project.update({
      where: { id: projectId },
      data: { status: 'generated' },
    });

    return documents;
  }

  private async generateMockDocuments(project: { id: string; name: string; industry: string }) {
    const mockDocs = [
      {
        type: 'business_design',
        title: '商业设计说明书',
        content: this.getMockBusinessDesign(project),
      },
      {
        type: 'function_design',
        title: '功能设计说明',
        content: this.getMockFunctionDesign(project),
      },
      {
        type: 'evaluation',
        title: '项目评价表',
        content: this.getMockEvaluation(project),
      },
      {
        type: 'risk',
        title: '风险提示表',
        content: this.getMockRisk(project),
      },
    ];

    return Promise.all(
      mockDocs.map((doc) =>
        this.prisma.document.create({
          data: {
            projectId: project.id,
            version: 1,
            type: doc.type,
            title: doc.title,
            content: doc.content,
          },
        }),
      ),
    );
  }

  private getMockBusinessDesign(project: { name: string; industry: string }): string {
    return `# ${project.name} - 商业设计说明书

## 一、项目概述

### 项目名称与定位
**项目名称**：${project.name}
**行业领域**：${project.industry}
**核心定位**：为用户提供创新的${project.industry}解决方案

### 核心价值主张
- 解决用户在${project.industry}领域的核心痛点
- 提供便捷、高效的服务体验
- 利用AI技术提升服务质量和效率

### 目标用户群体
- 主要用户：${project.industry}行业从业者
- 潜在用户：对${project.industry}服务有需求的个人和企业

## 二、商业模式

### 收入来源
1. **订阅服务**：月度/年度会员订阅
2. **增值服务**：高级功能付费解锁
3. **企业定制**：为企业客户提供定制化解决方案

### 成本结构
- 技术研发成本：40%
- 运营推广成本：30%
- 人力成本：20%
- 其他成本：10%

### 盈利模式
采用"免费增值"模式，基础功能免费，高级功能付费

## 三、市场分析

### 市场规模
- TAM（总潜在市场）：100亿元
- SAM（可服务市场）：20亿元
- SOM（可获得市场）：2亿元

### 目标市场定位
聚焦于${project.industry}行业的中小型企业和个人用户

## 四、运营策略

### 获客渠道
1. 搜索引擎优化（SEO）
2. 社交媒体营销
3. 内容营销
4. 口碑传播

### 用户留存策略
- 新用户引导教程
- 定期功能更新
- 用户反馈快速响应
- 会员权益体系

## 五、发展阶段

### 第一阶段（0-6个月）
- 完成MVP开发
- 获取1000名种子用户
- 验证商业模式

### 第二阶段（6-12个月）
- 完善产品功能
- 用户增长至10000人
- 实现盈亏平衡`;
  }

  private getMockFunctionDesign(project: { name: string; industry: string }): string {
    return `# ${project.name} - 功能设计说明

## 一、产品定位

### 产品核心功能
为${project.industry}行业用户提供智能化的商业策划服务

### 用户使用场景
1. 创业者制定商业计划
2. 企业决策者评估新业务
3. 投资人评估项目可行性

## 二、产品架构

### 整体架构
前端（Vue 3） → API网关 → 业务服务层 → 数据层

### 核心模块划分
1. **用户模块**：注册、登录、权限管理
2. **项目模块**：项目创建、管理、状态跟踪
3. **对话模块**：AI对话、消息管理
4. **文档模块**：文档生成、编辑、导出

## 三、功能清单（MVP）

### 核心功能
| 功能名称 | 功能描述 | 优先级 |
|---------|---------|--------|
| 用户注册登录 | 邮箱注册、JWT认证 | P0 |
| 项目管理 | 创建、查看、删除项目 | P0 |
| AI对话 | 与AI顾问进行多轮对话 | P0 |
| 文档生成 | 自动生成4份商业文档 | P0 |

### 辅助功能
| 功能名称 | 功能描述 | 优先级 |
|---------|---------|--------|
| 案例展示 | 展示优秀商业策划案例 | P1 |
| 文档编辑 | 编辑已生成的文档 | P1 |
| 版本管理 | 文档版本历史管理 | P1 |

## 四、AI应用场景

### 可应用的AI技术
- 大语言模型（Kimi）
- 自然语言处理
- 文本生成

### 预期效果
- 减少80%的文档编写时间
- 提供专业化的商业分析视角
- 降低商业策划门槛`;
  }

  private getMockEvaluation(project: { name: string; industry: string }): string {
    return `# ${project.name} - 项目评价表

## 一、SWOT分析

### 优势（Strengths）
1. 创新的AI驱动商业模式
2. 低成本高效率的服务方式
3. 可扩展的产品架构
4. 专业的商业分析能力

### 劣势（Weaknesses）
1. 初期品牌知名度低
2. AI服务成本较高
3. 团队规模有限
4. 用户信任需要时间建立

### 机会（Opportunities）
1. AI技术快速发展
2. 创业服务市场需求增长
3. 数字化转型趋势
4. 政策支持创新创业

### 威胁（Threats）
1. 大型科技公司可能进入
2. AI服务稳定性风险
3. 用户隐私安全要求提高
4. 市场竞争加剧

## 二、可行性评分

| 维度 | 评分(1-10) | 评分依据 |
|------|-----------|----------|
| 市场可行性 | 8 | 市场需求明确，目标用户群体清晰 |
| 技术可行性 | 7 | 技术方案成熟，AI服务可接入 |
| 财务可行性 | 6 | 初期投入适中，需要控制成本 |
| 团队可行性 | 6 | 核心团队需要补充关键人才 |
| 综合评分 | 6.75 | 整体可行性较高，需关注风险控制 |

## 三、关键指标

### 北极星指标
月活跃用户数（MAU）

### 关键业务指标
- 新用户注册转化率
- 用户留存率（次日/7日/30日）
- 付费转化率
- ARPU（每用户平均收入）`;
  }

  private getMockRisk(project: { name: string; industry: string }): string {
    return `# ${project.name} - 风险提示表

## 一、市场风险

| 风险项 | 风险等级 | 影响描述 | 应对策略 | 预警指标 |
|--------|---------|----------|----------|----------|
| 市场需求不足 | 中 | 用户增长低于预期 | 加强市场调研，调整产品定位 | 月新增用户<100 |
| 竞争对手进入 | 高 | 市场份额被抢占 | 建立技术壁垒，提升用户体验 | 竞品出现相似功能 |

## 二、技术风险

| 风险项 | 风险等级 | 影响描述 | 应对策略 | 预警指标 |
|--------|---------|----------|----------|----------|
| AI服务不稳定 | 高 | 核心功能不可用 | 多AI服务商备份，降级方案 | API错误率>5% |
| 数据泄露 | 高 | 用户信任受损 | 加强安全措施，定期审计 | 安全事件发生 |

## 三、运营风险

| 风险项 | 风险等级 | 影响描述 | 应对策略 | 预警指标 |
|--------|---------|----------|----------|----------|
| 用户流失 | 中 | 收入下降 | 用户运营，提升留存 | 月流失率>10% |
| 内容质量差 | 中 | 用户满意度低 | AI优化，人工审核 | 差评率>5% |

## 四、财务风险

| 风险项 | 风险等级 | 影响描述 | 应对策略 | 预警指标 |
|--------|---------|----------|----------|----------|
| AI成本过高 | 高 | 利润率下降 | 优化调用，成本控制 | 成本占比>50% |
| 资金链断裂 | 高 | 运营中断 | 融资储备，成本控制 | 现金流<3个月 |

## 五、风险应对建议

### 优先关注的高风险项
1. **AI服务不稳定**：建立多服务商备份机制
2. **数据安全**：投入安全建设，定期安全审计
3. **资金链风险**：提前规划融资，控制烧钱速度`;
  }

  private async generateBusinessDesign(
    project: { id: string; name: string; industry: string },
    conversation: string,
  ) {
    const prompt = `基于以下对话内容，为"${project.name}"项目生成一份商业设计说明书。

对话内容：
${conversation}

请生成包含以下内容的商业设计说明书（Markdown格式）：

# 商业设计说明书

## 一、项目概述
- 项目名称与定位
- 核心价值主张
- 目标用户群体

## 二、商业模式
- 收入来源
- 成本结构
- 盈利模式

## 三、市场分析
- 市场规模（TAM/SAM/SOM）
- 目标市场定位
- 竞争对手分析

## 四、运营策略
- 获客渠道
- 用户留存策略
- 增长路径

## 五、发展阶段
- 第一阶段目标与里程碑
- 第二阶段目标与里程碑
- 关键指标（KPI）

请确保内容具体、可执行，避免空泛描述。`;

    const content = await this.callKimi(prompt);

    return this.prisma.document.create({
      data: {
        projectId: project.id,
        version: 1,
        type: 'business_design',
        title: '商业设计说明书',
        content,
      },
    });
  }

  private async generateFunctionDesign(
    project: { id: string; name: string; industry: string },
    conversation: string,
  ) {
    const prompt = `基于以下对话内容，为"${project.name}"项目生成一份互联网软件功能设计说明。

对话内容：
${conversation}

请生成包含以下内容的功能设计说明（Markdown格式），采用MVP（最小可行产品）思路：

# 互联网软件功能设计说明

## 一、产品定位
- 产品核心功能
- 用户使用场景

## 二、产品架构
- 整体架构图（文字描述）
- 核心模块划分

## 三、功能清单（MVP）
### 3.1 核心功能
- 功能名称
- 功能描述
- 优先级

### 3.2 辅助功能
- 功能名称
- 功能描述
- 优先级

## 四、AI应用场景
- 可应用的AI技术
- 具体应用场景
- 预期效果

## 五、数据流设计
- 核心数据实体
- 数据流转路径

## 六、技术选型建议
- 前端技术
- 后端技术
- 数据存储

请确保功能设计简洁实用，避免冗余功能。`;

    const content = await this.callKimi(prompt);

    return this.prisma.document.create({
      data: {
        projectId: project.id,
        version: 1,
        type: 'function_design',
        title: '功能设计说明',
        content,
      },
    });
  }

  private async generateEvaluation(
    project: { id: string; name: string; industry: string },
    conversation: string,
  ) {
    const prompt = `基于以下对话内容，为"${project.name}"项目生成一份项目评价表。

对话内容：
${conversation}

请生成包含以下内容的项目评价表（Markdown格式）：

# 项目评价表

## 一、SWOT分析
### 优势（Strengths）
- 具体列出3-5项优势

### 劣势（Weaknesses）
- 具体列出3-5项劣势

### 机会（Opportunities）
- 具体列出3-5项机会

### 威胁（Threats）
- 具体列出3-5项威胁

## 二、可行性评分
| 维度 | 评分(1-10) | 评分依据 |
|------|-----------|----------|
| 市场可行性 | | |
| 技术可行性 | | |
| 财务可行性 | | |
| 团队可行性 | | |
| 综合评分 | | |

## 三、关键指标
- 北极星指标
- 关键业务指标
- 运营指标

## 四、行业对比
| 对标企业 | 相似点 | 差异点 | 可借鉴之处 |
|----------|--------|--------|-----------|
| | | | |

## 五、综合评价
- 项目优势总结
- 需要关注的问题
- 发展建议

请确保分析具体，避免泛泛而谈。`;

    const content = await this.callKimi(prompt);

    return this.prisma.document.create({
      data: {
        projectId: project.id,
        version: 1,
        type: 'evaluation',
        title: '项目评价表',
        content,
      },
    });
  }

  private async generateRisk(
    project: { id: string; name: string; industry: string },
    conversation: string,
  ) {
    const prompt = `基于以下对话内容，为"${project.name}"项目生成一份风险提示表。

对话内容：
${conversation}

请生成包含以下内容的风险提示表（Markdown格式），覆盖市场、技术、运营、法律、财务5个维度：

# 项目风险提示表

## 一、市场风险
| 风险项 | 风险等级(高/中/低) | 影响描述 | 应对策略 | 预警指标 |
|--------|-------------------|----------|----------|----------|
| | | | | |

## 二、技术风险
| 风险项 | 风险等级(高/中/低) | 影响描述 | 应对策略 | 预警指标 |
|--------|-------------------|----------|----------|----------|
| | | | | |

## 三、运营风险
| 风险项 | 风险等级(高/中/低) | 影响描述 | 应对策略 | 预警指标 |
|--------|-------------------|----------|----------|----------|
| | | | | |

## 四、法律风险
| 风险项 | 风险等级(高/中/低) | 影响描述 | 应对策略 | 预警指标 |
|--------|-------------------|----------|----------|----------|
| | | | | |

## 五、财务风险
| 风险项 | 风险等级(高/中/低) | 影响描述 | 应对策略 | 预警指标 |
|--------|-------------------|----------|----------|----------|
| | | | | |

## 六、风险应对建议
- 优先关注的高风险项
- 风险监控机制建议
- 应急预案要点

请确保每个风险都有明确的应对策略和可量化的预警指标。`;

    const content = await this.callKimi(prompt);

    return this.prisma.document.create({
      data: {
        projectId: project.id,
        version: 1,
        type: 'risk',
        title: '风险提示表',
        content,
      },
    });
  }

  private async callKimi(prompt: string): Promise<string> {
    if (!this.openai) {
      throw new Error('Kimi API Key not configured');
    }

    const model = this.configService.get<string>('kimi.model') || 'moonshot-v1-8k';

    try {
      const response = await this.openai.chat.completions.create({
        model,
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 4000,
        temperature: 0.7,
      });

      return response.choices[0]?.message?.content || '';
    } catch (error) {
      this.logger.error('Kimi API error:', error);
      throw new Error('文档生成失败，请稍后重试');
    }
  }

  async findByProjectId(userId: string, projectId: string) {
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

    return this.prisma.document.findMany({
      where: { projectId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(userId: string, documentId: string) {
    const document = await this.prisma.document.findUnique({
      where: { id: documentId },
      include: {
        project: {
          select: { userId: true },
        },
      },
    });

    if (!document || document.project.userId !== userId) {
      throw new Error('文档不存在');
    }

    const { project, ...result } = document;
    return result;
  }

  async update(userId: string, documentId: string, updateDocumentDto: UpdateDocumentDto) {
    const document = await this.findOne(userId, documentId);

    const latestDocument = await this.prisma.document.findFirst({
      where: {
        projectId: document.projectId,
        type: document.type,
      },
      orderBy: { version: 'desc' },
    });

    const newVersion = (latestDocument?.version ?? 0) + 1;

    return this.prisma.document.create({
      data: {
        projectId: document.projectId,
        version: newVersion,
        type: document.type,
        title: document.title,
        content: updateDocumentDto.content,
        customLabel: updateDocumentDto.customLabel,
      },
    });
  }
}
