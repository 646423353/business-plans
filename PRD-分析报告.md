# 商业策划机 PRD 分析报告

## 1. 核心功能模块清单（按优先级排序）

| 优先级 | 模块 | 权重说明 |
|--------|------|----------|
| **P0** | 用户账户系统 | 基础设施，无账户则无其他功能 |
| **P0** | AI对话系统 | 核心价值，用户与AI顾问的交互核心 |
| **P0** | 项目管理系统 | 核心载体，所有业务围绕项目展开 |
| **P0** | 文档生成系统 | 核心交付物，产品最终价值输出 |
| **P1** | 文档查看与编辑系统 | 重要用户体验，文档消费场景 |
| **P1** | 案例展示系统 | 获客与教育，游客转化的关键入口 |
| **P2** | 运营后台（案例管理、用户管理、内容审核） | 辅助运营，长期价值 |

---

## 2. 用户故事列表

### 2.1 游客

| 用户故事 | 操作路径 |
|----------|----------|
| **US-G1** 浏览案例建立产品认知 | 访问首页 → 查看案例卡片 → 点击进入案例详情 → 阅读4份示例文档 |
| **US-G2** 了解产品价值 | 首页查看案例展示区 → 理解商业策划机能做什么 |

### 2.2 注册用户（免费版）

| 用户故事 | 操作路径 |
|----------|----------|
| **US-F1** 创建首个商业项目 | 登录 → 点击"新建项目" → 输入项目名称 → 选择行业类型 → 进入首轮对话 |
| **US-F2** 与AI顾问进行方向确认 | 输入创业想法 → AI复述确认 → 用户确认/修正方向 |
| **US-F3** 继续深度对话分析 | 在对话区输入信息 → AI引导式提问 → 持续多轮对话（第2-99轮） |
| **US-F4** 主动触发文档生成 | 对话过程中点击"生成文档" → 系统生成4份文档 → 项目锁定 |
| **US-F5** 查看生成文档 | 进入文档页 → 切换渲染视图/原始视图 → 阅读商业设计说明书等功能文档 |
| **US-F6** 管理项目列表 | 返回项目列表 → 查看项目状态（对话中/已生成）→ 搜索项目 → 删除项目 |
| **US-F7** 导出文档 | 文档页点击"复制"或"下载" → 获取Markdown内容 |
| **US-F8** 重新生成文档 | 已生成版本项目 → 点击"重新生成" → 创建新版本（保留历史） |

### 2.3 注册用户（专业版）

| 用户故事 | 操作路径 |
|----------|----------|
| **US-P1** 享有多项目配额 | 每日可创建多个项目（超免费版1个/日限制） |
| **US-P2** 无限对话轮次 | 无100轮限制，可深度讨论 |
| **US-P3** 编辑文档 | 文档页点击"编辑" → 全屏编辑 → 保存为新版本 |
| **US-P4** 版本管理 | 版本选择器切换版本 → 查看历史 → 回退到指定版本 → 添加版本标签 |

---

## 3. 数据实体清单

### 3.1 核心实体

#### 用户 (User)

| 字段 | 类型 | 说明 |
|------|------|------|
| id | UUID | 主键 |
| username | string | 用户名 |
| email | string | 邮箱 |
| phone | string | 手机号 |
| avatar | string | 头像URL |
| password_hash | string | 密码哈希 |
| role | enum | guest/free/pro |
| created_at | datetime | 创建时间 |
| last_login_at | datetime | 最后登录时间 |
| quota_daily_used | int | 每日已用项目数 |
| quota_daily_reset_date | date | 配额重置日期 |

#### 项目 (Project)

| 字段 | 类型 | 说明 |
|------|------|------|
| id | UUID | 主键 |
| user_id | UUID | 所属用户ID |
| name | string | 项目名称 |
| industry | enum | 行业类型（餐饮/零售/SaaS/电商/教育/...） |
| status | enum | 项目状态（analyzing/generated） |
| current_turn | int | 当前对话轮次 |
| direction_confirmed | boolean | 首轮方向是否确认 |
| direction_confirm_turn | int | 确认时的轮次 |
| risk_flag | boolean | 方向不明确风险标记 |
| created_at | datetime | 创建时间 |
| updated_at | datetime | 更新时间 |
| deleted_at | datetime | 软删除时间 |

#### 对话消息 (Message)

| 字段 | 类型 | 说明 |
|------|------|------|
| id | UUID | 主键 |
| project_id | UUID | 所属项目ID |
| turn | int | 轮次编号 |
| role | enum | user/assistant |
| content | text | 消息内容 |
| created_at | datetime | 创建时间 |

#### 文档 (Document)

| 字段 | 类型 | 说明 |
|------|------|------|
| id | UUID | 主键 |
| project_id | UUID | 所属项目ID |
| version | int | 版本号 |
| type | enum | business_design/function_design/evaluation/risk |
| title | string | 文档标题 |
| content | markdown | Markdown内容 |
| custom_label | string | 自定义标签 |
| created_at | datetime | 创建时间 |
| updated_at | datetime | 更新时间 |

#### 案例 (Case)

| 字段 | 类型 | 说明 |
|------|------|------|
| id | UUID | 主键 |
| title | string | 案例标题 |
| industry | enum | 行业分类 |
| summary | string | 项目简介 |
| highlights | string[] | 核心亮点 |
| business_design | markdown | 商业设计说明书 |
| function_design | markdown | 功能设计说明 |
| evaluation | markdown | 项目评价表 |
| risk | markdown | 风险提示表 |
| is_published | boolean | 是否发布 |
| view_count | int | 浏览次数 |
| created_at | datetime | 创建时间 |
| updated_at | datetime | 更新时间 |

#### 行业分类 (Industry)

| 字段 | 类型 | 说明 |
|------|------|------|
| id | UUID | 主键 |
| name | string | 行业名称 |
| code | string | 行业代码 |
| icon | string | 图标 |
| sort_order | int | 排序 |
| is_active | boolean | 是否启用 |

### 3.2 关系图

```
User 1──N Project
Project 1──N Message
Project 1──N Document (多版本)
Case (独立，无用户关联)
Industry 1──N Project
Industry 1──N Case
```

---

## 4. 技术风险点识别

| 风险类别 | 风险点 | 影响 | 缓解策略 |
|----------|--------|------|----------|
| **AI对话质量** | 引导式对话效果不可控，可能偏离用户意图 | 用户体验下降，文档质量差 | 定义Prompt模板库，设置质量检查点 |
| **上下文管理** | 100轮对话上下文长，token成本高 | 响应慢、成本高 | 实施上下文摘要/压缩策略 |
| **文档生成一致性** | 多轮对话后生成文档可能遗漏信息 | 文档不完整 | 建立文档检查清单，生成前校验对话完整性 |
| **版本管理** | 文档编辑后保存为新版本，历史版本累积 | 存储膨胀 | 限制版本数量（如最多保留10个） |
| **高并发** | 多用户同时创建项目、对话 | 系统响应慢 | 限流、配额前置检查、异步处理 |
| **内容安全** | 用户输入敏感内容/AI输出不当 | 合规风险 | 敏感词过滤+AI内容审核双保险 |
| **AI响应超时** | 大模型响应慢/失败 | 用户流失 | 超时重试、降级策略、友好提示 |
| **数据一致性** | 项目状态、轮次计数可能不同步 | 数据错误 | 事务保证、幂等设计 |

---

## 5. 各 Agent 任务分工建议

| Agent | 核心职责 | 交付物 |
|-------|----------|--------|
| **prd-analyst** | 需求细化、业务流程拆解、用户故事完善、PRD查漏补缺 | 详细功能规格说明、业务流程图 |
| **software-architect** | 系统架构设计、技术选型、模块拆分、接口规范制定 | 系统架构图、技术方案文档、API设计 |
| **ui-ux-designer** | 页面原型设计、交互流程设计、视觉规范 | 设计稿、UI组件规范、交互流程图 |
| **database-engineer** | 数据库表结构设计、索引规划、数据迁移方案 | ER图、DDL脚本、数据字典 |
| **js-fullstack-backend-developer** | 后端API开发、业务逻辑实现、集成AI服务 | 后端代码、API接口、部署配置 |
| **vue-frontend-expert** | 前端页面开发、组件实现、状态管理 | 前端代码、Vite项目、组件库 |
| **senior-test-engineer** | 测试策略制定、测试用例编写、自动化测试 | 测试计划、测试用例、测试报告 |

### 建议工作流程

```
1. prd-analyst  →  输出细化后的功能清单
2. software-architect → 基于功能清单输出架构设计
3. database-engineer → 基于架构设计输出数据模型
4. ui-ux-designer → 基于功能清单和架构输出UI设计
5. js-fullstack-backend-developer + vue-frontend-expert → 并行开发
6. senior-test-engineer → 全程跟进，测试先行
```

---

以上分析已完成，后续各 agent 可基于此报告开展细化工作。