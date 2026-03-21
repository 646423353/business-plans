# OAuth 2.0 跨系统登录 - 部署指南

## 一、文件部署清单

### 1. 主系统 (dashhub) 需要添加的文件

| 源文件路径 | 目标路径 |
|-----------|---------|
| `main-system/models/OAuth.js` | `F:\claude-project\dashhub\backend\src\models\OAuth.js` |
| `main-system/controllers/oauthController.js` | `F:\claude-project\dashhub\backend\src\controllers\oauthController.js` |
| `main-system/routes/oauth.js` | `F:\claude-project\dashhub\backend\src\routes\oauth.js` |
| `main-system/sql/oauth_tables.sql` | 执行SQL创建表 |

### 2. 子系统 (business-planner) 需要添加的文件

| 源文件路径 | 目标路径 |
|-----------|---------|
| `sub-system/services/oauthService.js` | `backend/src/modules/oauth/oauth.service.ts` |
| `sub-system/controllers/oauthController.js` | `backend/src/modules/oauth/oauth.controller.ts` |
| `sub-system/frontend/OAuthCallback.vue` | `frontend/src/views/OAuthCallback.vue` |

---

## 二、主系统部署步骤

### 步骤1：执行数据库SQL

```bash
# 在dashhub目录下执行
mysql -u root -p dashhub < docs/oauth-implementation/main-system/sql/oauth_tables.sql
```

### 步骤2：复制文件

```powershell
# 复制模型文件
Copy-Item "docs/oauth-implementation/main-system/models/OAuth.js" "F:\claude-project\dashhub\backend\src\models\OAuth.js"

# 复制控制器文件
Copy-Item "docs/oauth-implementation/main-system/controllers/oauthController.js" "F:\claude-project\dashhub\backend\src\controllers\oauthController.js"

# 复制路由文件
Copy-Item "docs/oauth-implementation/main-system/routes/oauth.js" "F:\claude-project\dashhub\backend\src\routes\oauth.js"
```

### 步骤3：修改主系统入口文件

在 `F:\claude-project\dashhub\backend\src\index.js` 中添加：

```javascript
// 在 import 部分添加
import oauthRoutes from './routes/oauth.js';

// 在 Routes 部分添加
app.use('/oauth', oauthRoutes);
```

### 步骤4：更新CORS配置

在 `F:\claude-project\dashhub\backend\src\index.js` 中更新CORS：

```javascript
app.use(cors({
  origin: [
    'http://localhost:5173',   // 主系统前端
    'http://localhost:5174',   // 子系统前端
    'http://localhost:3000',   // 子系统后端
  ],
  credentials: true
}));
```

### 步骤5：添加环境变量

在 `F:\claude-project\dashhub\backend\.env` 中添加：

```env
# OAuth配置
OAUTH_CODE_EXPIRES=600
OAUTH_ACCESS_TOKEN_EXPIRES=7200
OAUTH_REFRESH_TOKEN_EXPIRES=2592000
FRONTEND_URL=http://localhost:5174
```

---

## 三、子系统部署步骤

### 步骤1：更新数据库Schema

在 `backend/prisma/schema.prisma` 中添加：

```prisma
model OAuthBinding {
  id              String   @id @default(uuid())
  userId          String   @map("user_id")
  provider        String
  providerUserId  String   @map("provider_user_id")
  accessToken     String?  @map("access_token")
  refreshToken    String?  @map("refresh_token")
  expiresAt       DateTime? @map("expires_at")
  createdAt       DateTime @default(now()) @map("created_at")
  updatedAt       DateTime @updatedAt @map("updated_at")
  
  user User @relation(fields: [userId], references: [id])
  
  @@unique([provider, providerUserId])
  @@map("oauth_bindings")
}
```

然后执行：

```bash
cd backend
npx prisma migrate dev --name add_oauth_bindings
```

### 步骤2：创建OAuth模块

```bash
# 创建目录
mkdir -p backend/src/modules/oauth

# 复制服务文件（需要转换为TypeScript）
# 复制控制器文件（需要转换为TypeScript）
```

### 步骤3：添加前端路由

在 `frontend/src/router/index.ts` 中添加：

```typescript
{
  path: '/auth/callback',
  name: 'OAuthCallback',
  component: () => import('@/views/OAuthCallback.vue'),
  meta: { title: '登录处理中', public: true },
},
```

### 步骤4：添加环境变量

在 `backend/.env` 中添加：

```env
# OAuth客户端配置
OAUTH_CLIENT_ID=business-planner
OAUTH_CLIENT_SECRET=bp-secret-key-2026-change-in-production
OAUTH_AUTHORIZE_URL=http://localhost:3001/oauth/authorize
OAUTH_TOKEN_URL=http://localhost:3001/oauth/token
OAUTH_USERINFO_URL=http://localhost:3001/oauth/userinfo
OAUTH_REDIRECT_URI=http://localhost:5173/auth/callback
```

---

## 四、登录页改造

在 `frontend/src/views/Login.vue` 中添加一键登录按钮：

```vue
<!-- 在登录表单上方添加 -->
<div class="oauth-section">
  <button class="oauth-btn" @click="handleOAuthLogin">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
    </svg>
    <span>主系统一键登录</span>
  </button>
  <div class="divider">
    <span>或</span>
  </div>
</div>
```

添加方法：

```typescript
async function handleOAuthLogin() {
  try {
    const res = await fetch('/api/auth/oauth/authorize-url')
    const data = await res.json()
    if (data.success) {
      window.location.href = data.data.url
    }
  } catch (error) {
    console.error('OAuth login failed:', error)
  }
}
```

---

## 五、测试流程

### 1. 启动主系统

```bash
cd F:\claude-project\dashhub\backend
npm run dev
# 主系统运行在 http://localhost:3001
```

### 2. 启动子系统

```bash
cd f:\ai-projects\business-plans\backend
npm run start:dev
# 子系统后端运行在 http://localhost:3000

cd f:\ai-projects\business-plans\frontend
npm run dev
# 子系统前端运行在 http://localhost:5173
```

### 3. 测试登录流程

1. 访问子系统登录页 `http://localhost:5173/login`
2. 点击"主系统一键登录"按钮
3. 跳转到主系统授权页面
4. 登录主系统并授权
5. 自动跳回子系统并完成登录

---

## 六、常见问题

### Q1: 提示"invalid_client"
检查主系统数据库 `oauth_clients` 表中是否有正确的客户端记录。

### Q2: 提示"invalid_redirect_uri"
检查 `oauth_clients` 表中的 `redirect_uris` 是否包含子系统配置的回调地址。

### Q3: CORS错误
确保主系统的CORS配置包含子系统前端地址。

---

**文档结束**
