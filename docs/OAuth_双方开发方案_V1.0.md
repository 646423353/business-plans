# OAuth 2.0 跨系统登录 - 双方开发方案

| 文档版本 | 日期 | 作者 | 变更说明 |
|---------|------|------|---------|
| V1.0 | 2026-03-21 | 开发团队 | 初始版本 |

---

## 一、系统架构

```
┌─────────────────────────────────────────────────────────────────────┐
│                           用户浏览器                                  │
└─────────────────────────────────────────────────────────────────────┘
                    │                           │
                    ▼                           ▼
┌───────────────────────────┐     ┌───────────────────────────┐
│      子系统 (本项目)        │     │      主系统 (待开发)        │
│   business-planner        │     │   main-system             │
│                           │     │                           │
│  ┌─────────────────────┐  │     │  ┌─────────────────────┐  │
│  │ OAuth Client        │  │     │  │ OAuth Server        │  │
│  │ - 授权请求          │  │     │  │ - 授权端点          │  │
│  │ - Token交换         │  │     │  │ - Token端点         │  │
│  │ - 用户信息获取      │◄─┼─────┼──│ - 用户信息端点      │  │
│  └─────────────────────┘  │     │  └─────────────────────┘  │
│                           │     │                           │
│  ┌─────────────────────┐  │     │  ┌─────────────────────┐  │
│  │ 用户数据库          │  │     │  │ 用户数据库          │  │
│  │ - oauth_bindings    │  │     │  │ - oauth_clients     │  │
│  │ - users             │  │     │  │ - oauth_tokens      │  │
│  └─────────────────────┘  │     │  │ - users             │  │
│                           │     │  └─────────────────────┘  │
└───────────────────────────┘     └───────────────────────────┘
```

---

## 二、开发任务分配

### 2.1 主系统开发任务（OAuth服务端）

| 序号 | 任务 | 文件 | 说明 |
|------|------|------|------|
| M1 | OAuth客户端管理 | `oauth-client.service.ts` | 注册/管理客户端应用 |
| M2 | 授权端点 | `oauth.controller.ts` | `/oauth/authorize` |
| M3 | Token端点 | `oauth.controller.ts` | `/oauth/token` |
| M4 | 用户信息端点 | `oauth.controller.ts` | `/oauth/userinfo` |
| M5 | 授权码管理 | `oauth-code.service.ts` | 生成/验证授权码 |
| M6 | Token管理 | `oauth-token.service.ts` | 生成/验证Token |
| M7 | 数据库表 | `schema.prisma` | oauth_clients, oauth_codes, oauth_tokens |

### 2.2 子系统开发任务（OAuth客户端）

| 序号 | 任务 | 文件 | 说明 |
|------|------|------|------|
| S1 | OAuth服务 | `oauth.service.ts` | 授权URL生成、Token交换 |
| S2 | OAuth控制器 | `oauth.controller.ts` | 回调处理 |
| S3 | 数据库表 | `schema.prisma` | oauth_bindings |
| S4 | 前端登录页 | `Login.vue` | 一键登录按钮 |
| S5 | 前端回调页 | `OAuthCallback.vue` | 回调处理页面 |

---

## 三、接口规范

### 3.1 主系统提供的接口

#### 3.1.1 授权端点 (GET /oauth/authorize)

**请求参数：**
```
response_type=code          # 固定值
client_id=business-planner  # 客户端ID
redirect_uri=https://planner.com/auth/callback
state=随机字符串            # 防CSRF
scope=openid profile email  # 权限范围
```

**响应：**
- 用户未登录：重定向到登录页
- 用户已登录：显示授权确认页
- 用户确认后：重定向到 `redirect_uri?code=xxx&state=xxx`

#### 3.1.2 Token端点 (POST /oauth/token)

**请求参数：**
```json
{
  "grant_type": "authorization_code",
  "code": "授权码",
  "redirect_uri": "https://planner.com/auth/callback",
  "client_id": "business-planner",
  "client_secret": "客户端密钥"
}
```

**响应：**
```json
{
  "access_token": "主系统访问令牌",
  "token_type": "Bearer",
  "expires_in": 7200,
  "refresh_token": "刷新令牌"
}
```

#### 3.1.3 用户信息端点 (GET /oauth/userinfo)

**请求头：**
```
Authorization: Bearer {access_token}
```

**响应：**
```json
{
  "sub": "主系统用户ID",
  "username": "用户名",
  "email": "用户邮箱",
  "avatar": "头像URL",
  "role": "用户角色"
}
```

### 3.2 子系统提供的接口

#### 3.2.1 获取授权URL (GET /api/auth/oauth/authorize-url)

**响应：**
```json
{
  "url": "https://main.com/oauth/authorize?...",
  "state": "状态码"
}
```

#### 3.2.2 OAuth回调处理 (GET /api/auth/oauth/callback)

**请求参数：**
```
code=授权码
state=状态码
```

**响应：**
- 成功：设置Cookie，重定向到工作台
- 失败：重定向到登录页并显示错误

---

## 四、数据库设计

### 4.1 主系统新增表

```prisma
// OAuth客户端表
model OAuthClient {
  id            String   @id @default(uuid())
  clientId      String   @unique @map("client_id")
  clientSecret  String   @map("client_secret")
  name          String
  redirectUris  String   @map("redirect_uris")  // JSON数组
  scopes        String   // JSON数组
  isActive      Boolean  @default(true) @map("is_active")
  createdAt     DateTime @default(now()) @map("created_at")
  
  @@map("oauth_clients")
}

// OAuth授权码表
model OAuthCode {
  id          String   @id @default(uuid())
  code        String   @unique
  clientId    String   @map("client_id")
  userId      String   @map("user_id")
  redirectUri String   @map("redirect_uri")
  scopes      String   // JSON数组
  expiresAt   DateTime @map("expires_at")
  used        Boolean  @default(false)
  createdAt   DateTime @default(now()) @map("created_at")
  
  @@map("oauth_codes")
}

// OAuth Token表
model OAuthToken {
  id            String   @id @default(uuid())
  accessToken   String   @unique @map("access_token")
  refreshToken  String?  @unique @map("refresh_token")
  clientId      String   @map("client_id")
  userId        String   @map("user_id")
  scopes        String   // JSON数组
  expiresAt     DateTime @map("expires_at")
  createdAt     DateTime @default(now()) @map("created_at")
  
  @@map("oauth_tokens")
}
```

### 4.2 子系统新增表

```prisma
// OAuth绑定表
model OAuthBinding {
  id              String   @id @default(uuid())
  userId          String   @map("user_id")
  provider        String   // "main_system"
  providerUserId  String   @map("provider_user_id")
  accessToken     String?  @map("access_token")  // 加密存储
  refreshToken    String?  @map("refresh_token") // 加密存储
  expiresAt       DateTime? @map("expires_at")
  createdAt       DateTime @default(now()) @map("created_at")
  updatedAt       DateTime @updatedAt @map("updated_at")
  
  user User @relation(fields: [userId], references: [id])
  
  @@unique([provider, providerUserId])
  @@map("oauth_bindings")
}
```

---

## 五、配置项

### 5.1 主系统配置 (.env)

```env
# OAuth服务端配置
OAUTH_CODE_EXPIRES=600          # 授权码有效期(秒)
OAUTH_ACCESS_TOKEN_EXPIRES=7200 # 访问令牌有效期(秒)
OAUTH_REFRESH_TOKEN_EXPIRES=2592000 # 刷新令牌有效期(秒)
```

### 5.2 子系统配置 (.env)

```env
# OAuth客户端配置
OAUTH_CLIENT_ID=business-planner
OAUTH_CLIENT_SECRET=your-client-secret
OAUTH_AUTHORIZE_URL=http://localhost:4000/oauth/authorize
OAUTH_TOKEN_URL=http://localhost:4000/oauth/token
OAUTH_USERINFO_URL=http://localhost:4000/oauth/userinfo
OAUTH_REDIRECT_URI=http://localhost:5173/auth/callback
```

---

## 六、开发顺序建议

### 阶段一：主系统服务端 (预计2天)

1. 创建OAuth模块结构
2. 实现客户端管理（先手动插入客户端数据）
3. 实现授权码生成与验证
4. 实现Token生成与验证
5. 实现授权端点
6. 实现Token端点
7. 实现用户信息端点
8. 单元测试

### 阶段二：子系统客户端 (预计2天)

1. 更新数据库Schema
2. 实现OAuth服务
3. 实现回调控制器
4. 前端登录页改造
5. 前端回调页面
6. 单元测试

### 阶段三：联调测试 (预计1天)

1. 本地环境联调
2. 异常场景测试
3. 安全测试
4. 性能测试

---

## 七、安全检查清单

- [ ] 所有OAuth端点强制HTTPS
- [ ] state参数一次性使用，5分钟过期
- [ ] 授权码一次性使用，10分钟过期
- [ ] client_secret不在前端暴露
- [ ] Token加密存储
- [ ] 实现请求频率限制
- [ ] 记录安全审计日志

---

**文档结束**
