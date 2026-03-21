# 商业策划机

一款基于 AI 的智能商业策划助手，帮助创业者快速生成专业的商业策划文档。

## 项目概述

商业策划机是一个全栈 Web 应用，通过 AI 对话的方式引导用户梳理商业想法，最终生成完整的商业策划文档。用户只需描述创业想法，AI 会通过多轮对话深入了解项目细节，自动生成商业设计说明书、功能设计说明、项目评价表、风险提示表等专业文档。

### 核心价值

- **智能对话引导**：AI 通过引导式提问，帮助用户系统化梳理商业想法
- **专业文档生成**：自动生成符合商业标准的策划文档
- **案例参考**：提供优秀商业案例供用户参考学习
- **多轮迭代优化**：支持多轮对话，不断完善商业策划

## 功能特性

### 用户功能

- 用户注册/登录
- 项目管理（创建、查看、删除）
- AI 智能对话
- 商业文档生成与编辑
- 成功案例浏览

### AI 对话功能

- 引导式商业分析
- 行业专业建议
- 商业模式优化
- 风险评估提示

### 文档生成

- 商业设计说明书
- 功能设计说明
- 项目评价表（SWOT 分析）
- 风险提示表

## 技术栈

### 前端

- **框架**：Vue 3.5 + TypeScript
- **构建工具**：Vite 8.0
- **UI 组件库**：Element Plus 2.13
- **状态管理**：Pinia 3.0
- **路由**：Vue Router 5.0
- **样式**：SCSS + 暗色主题

### 后端

- **框架**：NestJS 11.0
- **ORM**：Prisma 5.22
- **数据库**：MySQL 8.0
- **缓存**：Redis 7.0
- **AI 服务**：硅基流动 API（Qwen2.5-7B-Instruct）
- **认证**：JWT

## 项目结构

```
business-plans/
├── frontend/                # 前端项目
│   ├── src/
│   │   ├── components/      # 组件
│   │   ├── views/           # 页面
│   │   ├── store/           # 状态管理
│   │   ├── services/        # API 服务
│   │   ├── router/          # 路由配置
│   │   └── styles/          # 样式文件
│   └── ...
├── backend/                 # 后端项目
│   ├── src/
│   │   ├── modules/         # 业务模块
│   │   │   ├── auth/        # 认证模块
│   │   │   ├── chat/        # 对话模块
│   │   │   ├── project/     # 项目模块
│   │   │   ├── document/    # 文档模块
│   │   │   ├── case/        # 案例模块
│   │   │   └── user/        # 用户模块
│   │   ├── config/          # 配置文件
│   │   └── prisma/          # Prisma 服务
│   └── prisma/              # 数据库配置
│       ├── schema.prisma    # 数据模型
│       └── seed.ts          # 种子数据
└── docs/                    # 部署文档
    ├── 前端部署文档.md
    ├── 后端部署文档.md
    └── 数据库部署文档.md
```

## 快速开始

### 环境要求

- Node.js >= 18.0.0
- MySQL >= 8.0
- Redis >= 6.0
- npm >= 9.0.0

### 安装步骤

#### 1. 克隆项目

```bash
git clone https://github.com/646423353/business-plans.git
cd business-plans
```

#### 2. 安装后端依赖

```bash
cd backend
npm install
```

#### 3. 配置后端环境变量

复制 `.env.example` 为 `.env` 并修改配置：

```env
# 应用配置
PORT=3000
NODE_ENV=development

# 数据库配置
DATABASE_URL=mysql://root:your_password@localhost:3306/ai_business_planner

# Redis 配置
REDIS_HOST=localhost
REDIS_PORT=6379

# JWT 配置
JWT_SECRET=your-jwt-secret
JWT_EXPIRES_IN=7d

# 硅基流动 AI 配置
SILICONFLOW_API_KEY=your-api-key
SILICONFLOW_BASE_URL=https://api.siliconflow.cn/v1
SILICONFLOW_MODEL=Qwen/Qwen2.5-7B-Instruct
```

#### 4. 初始化数据库

```bash
# 生成 Prisma Client
npx prisma generate

# 运行数据库迁移
npx prisma migrate dev

# 填充种子数据
npx prisma db seed
```

#### 5. 启动后端服务

```bash
npm run start:dev
```

#### 6. 安装前端依赖

```bash
cd ../frontend
npm install
```

#### 7. 启动前端服务

```bash
npm run dev
```

#### 8. 访问应用

打开浏览器访问 http://localhost:5173

### 测试账号

种子数据包含一个测试账号：

- 邮箱：test@example.com
- 密码：123456

## 配置说明

### OAuth 一键登录配置

商业策划机支持通过 DashHub 主系统进行一键登录，实现统一的身份认证。

#### 后端配置

在 `backend/.env` 中添加：

```env
# OAuth 客户端配置
OAUTH_CLIENT_ID=business-planner
OAUTH_CLIENT_SECRET=bp-secret-key-2026-change-in-production
OAUTH_AUTH_URL=http://localhost:5174/oauth/authorize
OAUTH_TOKEN_URL=http://localhost:3001/oauth/token
OAUTH_USERINFO_URL=http://localhost:3001/oauth/userinfo
OAUTH_REDIRECT_URI=http://localhost:5173/auth/callback
```

#### 前端配置

在 `frontend/.env` 中添加：

```env
VITE_API_BASE_URL=http://localhost:3000/api
```

#### OAuth 流程说明

1. 用户点击"使用 DashHub 一键登录"按钮
2. 跳转到主系统授权页面
3. 用户登录主系统并授权
4. 主系统生成授权码并回调子系统
5. 子系统使用授权码换取用户信息
6. 子系统创建或更新用户，完成登录

#### 测试账号

主系统测试账号：
- 邮箱：user1@example.com
- 密码：password123

#### 常见问题

| 问题 | 解决方案 |
|------|----------|
| invalid_client | 检查主系统数据库 oauth_clients 表中是否有正确的客户端记录 |
| invalid_redirect_uri | 检查 redirect_uris 是否包含子系统配置的回调地址 |
| CORS 错误 | 检查主系统后端 CORS 配置是否包含子系统地址 |
| 登录后 401 | 检查子系统 JWT 配置是否正确（jwt.secret） |

### AI 模型配置

项目使用硅基流动 API，支持多种大语言模型：

| 模型 | 说明 |
|------|------|
| Qwen/Qwen2.5-7B-Instruct | 默认模型，性价比高 |
| Qwen/Qwen2.5-72B-Instruct | 更强大的推理能力 |
| deepseek-ai/DeepSeek-V2.5 | DeepSeek 模型 |

获取 API Key：https://cloud.siliconflow.cn/

### 数据库配置

详细配置请参考 [数据库部署文档](docs/数据库部署文档.md)

## 部署指南

详细的部署文档请参考：

- [前端部署文档](docs/前端部署文档.md) - Nginx、Vercel、Docker 部署方式
- [后端部署文档](docs/后端部署文档.md) - PM2、Docker、Kubernetes 部署方式
- [数据库部署文档](docs/数据库部署文档.md) - MySQL、Redis 部署配置

### Docker 快速部署

```bash
# 后端
cd backend
docker build -t business-planner-backend .
docker run -d -p 3000:3000 business-planner-backend

# 前端
cd frontend
docker build -t business-planner-frontend .
docker run -d -p 80:80 business-planner-frontend
```

## API 文档

后端 API 基础路径：`http://localhost:3000/api`

### 主要接口

| 方法 | 路径 | 说明 |
|------|------|------|
| POST | /auth/register | 用户注册 |
| POST | /auth/login | 用户登录 |
| GET | /users/me | 获取当前用户 |
| POST | /projects | 创建项目 |
| GET | /projects | 获取项目列表 |
| GET | /projects/:id | 获取项目详情 |
| DELETE | /projects/:id | 删除项目 |
| POST | /messages | 发送消息 |
| GET | /messages/:projectId | 获取对话历史 |
| POST | /documents/generate | 生成文档 |
| GET | /documents/:projectId | 获取文档列表 |
| GET | /cases | 获取案例列表 |
| GET | /cases/:id | 获取案例详情 |

## 贡献指南

欢迎提交 Issue 和 Pull Request！

### 开发流程

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 提交 Pull Request

### 代码规范

- 前端：遵循 Vue 3 官方风格指南
- 后端：遵循 NestJS 官方风格指南
- 提交信息：遵循 Conventional Commits 规范

## 许可证

本项目采用 MIT 许可证 - 详见 [LICENSE](LICENSE) 文件

## 联系方式

如有问题或建议，请提交 Issue 或联系项目维护者。

---

**商业策划机** - 让创业想法变成专业策划 🚀
