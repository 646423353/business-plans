# 商业策划机 - 跨系统一键登录功能 PRD

| 文档版本 | 日期 | 作者 | 变更说明 |
|---------|------|------|---------|
| V1.0 | 2026-03-21 | 产品规划师 | 初始版本 |

---

## 一、背景与目标

### 1.1 背景

当前"商业策划机"子系统拥有独立的账号体系，用户需要单独注册登录。为提升用户体验、降低注册门槛，需要实现与主系统之间的单点登录（SSO）能力，让主系统已登录用户可以无缝访问子系统。

### 1.2 目标

| 目标类型 | 描述 | 成功指标 |
|---------|------|---------|
| 用户体验 | 减少用户注册/登录操作步骤 | 一键登录成功率 > 95% |
| 用户增长 | 降低新用户流失率 | 登录页转化率提升 20% |
| 安全合规 | 确保身份验证安全可靠 | 无安全漏洞，通过安全审计 |

### 1.3 范围

- **包含**：OAuth 2.0 授权码模式实现、前端登录页改造、后端认证接口、安全防护
- **不包含**：主系统端改造（由主系统团队负责）、账号合并功能（V1.1规划）

---

## 二、用户场景

### 2.1 核心场景：主系统用户首次访问子系统

**角色**：主系统已注册用户

**场景描述**：
> 用户在主系统完成工作后，需要使用商业策划机生成项目方案。用户点击主系统导航栏的"商业策划机"入口，跳转至子系统登录页。用户看到"一键登录"按钮，点击后自动跳转至主系统授权页面，确认授权后自动返回子系统并完成登录，直接进入工作台。

**用户旅程**：

```
用户 -> 子系统登录页 -> 点击"一键登录" -> 主系统授权页 -> 确认授权 -> 子系统自动登录 -> 工作台
```

**情绪曲线**：
- 进入登录页：期待（希望快速开始工作）
- 看到一键登录：惊喜（不需要重新注册）
- 完成授权：满意（流程顺畅）
- 进入工作台：满足（目标达成）

### 2.2 异常场景

| 场景 | 触发条件 | 用户情绪 | 解决方案 |
|------|---------|---------|---------|
| 授权超时 | 网络延迟或主系统不可用 | 焦虑 | 提示"授权超时，请重试"，提供普通登录入口 |
| 用户取消授权 | 用户主动拒绝授权 | 困惑 | 提示"您取消了授权"，引导使用其他登录方式 |
| 账号冲突 | 主系统邮箱已被子系统其他账号使用 | 担忧 | 提示"邮箱已存在，请使用密码登录后绑定" |
| Token过期 | 长时间未操作 | 平静 | 自动刷新Token或引导重新授权 |

---

## 三、功能清单

### 3.1 功能概览

| 功能模块 | 功能名称 | 优先级 | 版本 |
|---------|---------|--------|------|
| 前端 | 一键登录按钮 | P0 | V1.0 |
| 前端 | OAuth授权跳转 | P0 | V1.0 |
| 前端 | 回调处理页面 | P0 | V1.0 |
| 前端 | 登录状态持久化 | P0 | V1.0 |
| 后端 | OAuth授权接口 | P0 | V1.0 |
| 后端 | Token交换接口 | P0 | V1.0 |
| 后端 | 用户信息同步 | P0 | V1.0 |
| 后端 | Token刷新机制 | P1 | V1.0 |
| 后端 | 安全防护中间件 | P0 | V1.0 |

### 3.2 功能详细设计

#### 3.2.1 一键登录按钮

**功能描述**：在登录页面添加"一键登录"按钮，与现有设计风格统一

**用户价值**：减少用户操作步骤，提升登录效率

**页面位置**：登录表单上方，与分隔线配合

**UI规范**：
```
+----------------------------------+
|     [主系统Logo] 一键登录         |
+----------------------------------+
|           -- 或 --               |
+----------------------------------+
|     [邮箱输入框]                  |
|     [密码输入框]                  |
|     [登录按钮]                    |
+----------------------------------+
```

**交互规则**：
- 点击按钮 -> 触发OAuth授权流程
- 按钮hover状态 -> 轻微上浮 + 阴影增强
- 按钮loading状态 -> 显示加载动画，禁用点击

#### 3.2.2 OAuth授权跳转

**功能描述**：构建授权URL并重定向至主系统授权页面

**输入**：无（从配置读取client_id、redirect_uri等）

**输出**：重定向至主系统授权页面

**流程**：
1. 生成随机state参数（防CSRF）
2. 将state存入Redis（有效期5分钟）
3. 构建授权URL
4. 重定向用户浏览器

**授权URL格式**：
```
{主系统授权端点}?response_type=code&client_id={CLIENT_ID}&redirect_uri={REDIRECT_URI}&scope=openid profile email&state={STATE}
```

#### 3.2.3 回调处理页面

**功能描述**：接收主系统回调，完成Token交换和用户登录

**路由**：`/auth/callback`

**输入参数**：
- `code`：授权码（必需）
- `state`：状态参数（必需）

**处理流程**：
1. 验证state参数（与Redis中存储的对比）
2. 使用code换取access_token
3. 使用access_token获取用户信息
4. 创建/更新本地用户记录
5. 生成本地JWT Token
6. 存储登录状态
7. 重定向至目标页面

**异常处理**：
- state不匹配 -> 提示"授权验证失败"，重定向至登录页
- code无效/过期 -> 提示"授权码已过期"，重定向至登录页
- 获取用户信息失败 -> 提示"获取用户信息失败"，重定向至登录页

---

## 四、接口设计

### 4.1 接口列表

| 接口名称 | 方法 | 路径 | 认证 |
|---------|------|------|------|
| 获取OAuth授权URL | GET | /auth/oauth/authorize-url | 否 |
| OAuth回调处理 | GET | /auth/oauth/callback | 否 |
| 刷新Token | POST | /auth/oauth/refresh | 是 |
| 绑定主系统账号 | POST | /auth/oauth/bind | 是 |

### 4.2 接口详细规范

#### 4.2.1 获取OAuth授权URL

**请求**：
```http
GET /auth/oauth/authorize-url HTTP/1.1
```

**响应**：
```json
{
  "code": 200,
  "data": {
    "authorizeUrl": "https://main-system.com/oauth/authorize?response_type=code&client_id=xxx&redirect_uri=xxx&scope=openid+profile+email&state=abc123",
    "state": "abc123"
  },
  "message": "success"
}
```

#### 4.2.2 OAuth回调处理

**请求**：
```http
GET /auth/oauth/callback?code=AUTHORIZATION_CODE&state=STATE_VALUE HTTP/1.1
```

**成功响应**：
```json
{
  "code": 200,
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "username": "张三",
      "avatar": "https://...",
      "role": "free"
    },
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "isNewUser": true
  },
  "message": "登录成功"
}
```

**错误响应**：
```json
{
  "code": 401,
  "data": null,
  "message": "授权验证失败：state不匹配"
}
```

#### 4.2.3 刷新Token

**请求**：
```http
POST /auth/oauth/refresh HTTP/1.1
Authorization: Bearer {refresh_token}
```

**响应**：
```json
{
  "code": 200,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
    "expiresIn": 604800
  },
  "message": "success"
}
```

#### 4.2.4 绑定主系统账号

**请求**：
```http
POST /auth/oauth/bind HTTP/1.1
Authorization: Bearer {current_token}
Content-Type: application/json

{
  "mainSystemUserId": "external_user_id"
}
```

**响应**：
```json
{
  "code": 200,
  "data": {
    "bound": true
  },
  "message": "绑定成功"
}
```

### 4.3 主系统接口依赖（需主系统团队提供）

| 接口 | 方法 | 说明 |
|------|------|------|
| 授权端点 | GET | 用户授权页面 |
| Token端点 | POST | code换取token |
| 用户信息端点 | GET | 获取用户基本信息 |

---

## 五、数据库设计

### 5.1 新增表：OAuth绑定表

**表名**：`oauth_bindings`

| 字段名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| id | CHAR(36) | Y | 主键UUID |
| user_id | CHAR(36) | Y | 关联本地用户ID |
| provider | VARCHAR(50) | Y | OAuth提供商标识（如：main_system） |
| provider_user_id | VARCHAR(100) | Y | 主系统用户ID |
| access_token | TEXT | N | 主系统access_token（加密存储） |
| refresh_token | TEXT | N | 主系统refresh_token（加密存储） |
| token_expires_at | DATETIME | N | Token过期时间 |
| created_at | DATETIME | Y | 创建时间 |
| updated_at | DATETIME | Y | 更新时间 |

**索引**：
- `idx_user_id` (user_id)
- `idx_provider_user` (provider, provider_user_id) - 唯一索引

### 5.2 修改表：用户表

**表名**：`users`

**新增字段**：

| 字段名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| auth_provider | VARCHAR(50) | N | 认证方式：local/oauth |
| main_system_id | VARCHAR(100) | N | 主系统用户ID（冗余字段，便于查询） |

### 5.3 Prisma Schema 更新

```prisma
model OAuthBinding {
  id              String   @id @default(uuid()) @db.Char(36)
  userId          String   @map("user_id") @db.Char(36)
  provider        String   @db.VarChar(50)
  providerUserId  String   @map("provider_user_id") @db.VarChar(100)
  accessToken     String?  @map("access_token") @db.Text
  refreshToken    String?  @map("refresh_token") @db.Text
  tokenExpiresAt  DateTime? @map("token_expires_at")
  createdAt       DateTime @default(now()) @map("created_at")
  updatedAt       DateTime @updatedAt @map("updated_at")
  user            User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerUserId])
  @@index([userId])
  @@map("oauth_bindings")
}

model User {
  // ... 现有字段
  authProvider    String?          @map("auth_provider") @db.VarChar(50)
  mainSystemId    String?          @map("main_system_id") @db.VarChar(100)
  oauthBindings   OAuthBinding[]
}
```

---

## 六、安全方案

### 6.1 安全威胁与防护

| 威胁类型 | 风险等级 | 防护措施 |
|---------|---------|---------|
| CSRF攻击 | 高 | state参数验证，一次性使用，5分钟过期 |
| 中间人攻击 | 高 | 全链路HTTPS，证书校验 |
| Token泄露 | 高 | Token加密存储，HttpOnly Cookie可选 |
| 重放攻击 | 中 | code一次性使用，短期有效（10分钟） |
| 授权码劫持 | 中 | PKCE扩展（可选），code + state绑定 |
| XSS攻击 | 中 | 输入过滤，CSP策略 |

### 6.2 安全实现细节

#### 6.2.1 State参数防护

```typescript
// 生成state
function generateState(): string {
  return crypto.randomBytes(32).toString('hex');
}

// 存储state（Redis，5分钟过期）
await redis.set(`oauth:state:${state}`, '1', 'EX', 300);

// 验证state
async function validateState(state: string): Promise<boolean> {
  const exists = await redis.del(`oauth:state:${state}`);
  return exists === 1; // 删除成功表示存在且一次性使用
}
```

#### 6.2.2 Token安全存储

```typescript
// 加密存储
import * as crypto from 'crypto';

function encryptToken(token: string, secret: string): string {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv('aes-256-gcm', Buffer.from(secret), iv);
  let encrypted = cipher.update(token, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  const authTag = cipher.getAuthTag();
  return `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted}`;
}
```

#### 6.2.3 HTTPS强制

```typescript
// NestJS 全局中间件
@Injectable()
export class HttpsMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: Function) {
    if (!req.secure && process.env.NODE_ENV === 'production') {
      return res.redirect(301, `https://${req.headers.host}${req.url}`);
    }
    next();
  }
}
```

### 6.3 Token过期策略

| Token类型 | 有效期 | 刷新策略 |
|----------|--------|---------|
| 授权码(code) | 10分钟 | 不可刷新，一次性使用 |
| 主系统Access Token | 2小时 | 使用Refresh Token刷新 |
| 主系统Refresh Token | 30天 | 重新授权 |
| 子系统JWT Token | 7天 | 自动续期（剩余<1天时） |

---

## 七、开发任务拆分

### 7.1 后端任务

| 任务ID | 任务名称 | 工时估算 | 依赖 | 交付物 |
|--------|---------|---------|------|--------|
| BE-01 | 数据库Schema更新 | 2h | 无 | Prisma migration |
| BE-02 | OAuth配置模块 | 2h | 无 | configuration.ts更新 |
| BE-03 | OAuth Service实现 | 6h | BE-01, BE-02 | oauth.service.ts |
| BE-04 | OAuth Controller实现 | 4h | BE-03 | oauth.controller.ts |
| BE-05 | State管理（Redis） | 2h | BE-02 | redis.service.ts更新 |
| BE-06 | Token加密/解密工具 | 2h | 无 | crypto.util.ts |
| BE-07 | 安全中间件 | 2h | 无 | security.middleware.ts |
| BE-08 | 单元测试 | 4h | BE-03~07 | *.spec.ts |
| BE-09 | 接口文档 | 2h | BE-04 | Swagger文档 |

**后端总工时**：26小时（约3.5人天）

### 7.2 前端任务

| 任务ID | 任务名称 | 工时估算 | 依赖 | 交付物 |
|--------|---------|---------|------|--------|
| FE-01 | 登录页UI改造 | 3h | 无 | Login.vue更新 |
| FE-02 | OAuth授权跳转逻辑 | 2h | BE-02 | auth.ts更新 |
| FE-03 | 回调页面组件 | 3h | BE-04 | OAuthCallback.vue |
| FE-04 | 路由配置更新 | 1h | FE-03 | router/index.ts |
| FE-05 | Store状态管理更新 | 2h | FE-02 | user.ts更新 |
| FE-06 | Token刷新拦截器 | 2h | FE-05 | request.ts更新 |
| FE-07 | 错误处理与提示 | 2h | FE-03 | 通用组件 |
| FE-08 | 单元测试 | 2h | FE-01~07 | *.spec.ts |
| FE-09 | E2E测试 | 3h | FE-01~07 | e2e测试用例 |

**前端总工时**：20小时（约2.5人天）

### 7.3 联调与测试

| 任务ID | 任务名称 | 工时估算 | 依赖 |
|--------|---------|---------|------|
| INT-01 | 主系统接口联调 | 4h | BE完成，主系统就绪 |
| INT-02 | 集成测试 | 4h | INT-01 |
| INT-03 | 安全测试 | 4h | INT-02 |
| INT-04 | 性能测试 | 2h | INT-02 |
| INT-05 | UAT验收 | 4h | INT-02~04 |

**联调测试总工时**：18小时（约2人天）

---

## 八、测试计划

### 8.1 测试用例

#### 8.1.1 功能测试

| 用例ID | 测试场景 | 前置条件 | 测试步骤 | 预期结果 |
|--------|---------|---------|---------|---------|
| TC-001 | 首次一键登录成功 | 主系统已登录，子系统未注册 | 1. 访问登录页 2. 点击一键登录 3. 确认授权 | 自动创建账号，登录成功，跳转工作台 |
| TC-002 | 已绑定用户一键登录 | 已绑定主系统账号 | 1. 访问登录页 2. 点击一键登录 3. 确认授权 | 直接登录成功，跳转工作台 |
| TC-003 | 用户取消授权 | 无 | 1. 访问登录页 2. 点击一键登录 3. 取消授权 | 提示"授权已取消"，留在登录页 |
| TC-004 | state参数篡改 | 无 | 1. 拦截回调请求 2. 修改state参数 | 提示"授权验证失败"，拒绝登录 |
| TC-005 | 授权码重复使用 | 无 | 1. 正常完成授权 2. 使用相同code再次请求 | 提示"授权码无效"，拒绝登录 |
| TC-006 | Token刷新 | Token即将过期 | 1. 发起请求 2. 触发刷新逻辑 | 无感知刷新，请求正常完成 |
| TC-007 | 邮箱冲突处理 | 主系统邮箱已被使用 | 1. 一键登录 | 提示"邮箱已存在，请使用密码登录" |

#### 8.1.2 安全测试

| 用例ID | 测试场景 | 测试方法 | 预期结果 |
|--------|---------|---------|---------|
| SEC-001 | CSRF防护验证 | 篡改/删除state参数 | 请求被拒绝 |
| SEC-002 | 重放攻击防护 | 重复使用授权码 | 第二次请求被拒绝 |
| SEC-003 | Token加密验证 | 检查数据库存储 | Token已加密，非明文 |
| SEC-004 | HTTPS强制 | HTTP请求 | 自动重定向至HTTPS |
| SEC-005 | 授权码有效期 | 使用过期授权码 | 请求被拒绝 |

#### 8.1.3 性能测试

| 指标 | 目标值 | 测试方法 |
|------|--------|---------|
| 授权跳转响应时间 | < 200ms | 模拟并发100用户 |
| 回调处理时间 | < 500ms | 模拟并发100用户 |
| Token刷新时间 | < 100ms | 模拟并发50用户 |

### 8.2 测试环境

| 环境 | 用途 | 配置 |
|------|------|------|
| 开发环境 | 开发自测 | 本地Docker |
| 测试环境 | 集成测试 | K8s集群 |
| 预发布环境 | UAT验收 | 生产配置 |

---

## 九、埋点需求

### 9.1 事件埋点

| 事件名称 | 触发时机 | 属性 |
|---------|---------|------|
| oauth_button_click | 点击一键登录按钮 | source: 'login_page' |
| oauth_authorize_start | 开始跳转授权页 | state, timestamp |
| oauth_authorize_success | 用户确认授权 | provider |
| oauth_authorize_cancel | 用户取消授权 | provider |
| oauth_callback_receive | 收到回调 | code, state |
| oauth_login_success | 登录成功 | user_id, is_new_user |
| oauth_login_fail | 登录失败 | error_code, error_message |
| token_refresh | Token刷新 | user_id |

### 9.2 漏斗分析

```
登录页PV -> 一键登录点击率 -> 授权确认率 -> 登录成功率
```

---

## 十、风险与依赖

### 10.1 风险清单

| 风险 | 等级 | 影响 | 缓解措施 |
|------|------|------|---------|
| 主系统接口变更 | 高 | 功能不可用 | 建立接口版本管理，提前沟通机制 |
| 主系统不可用 | 中 | 用户无法一键登录 | 保留普通登录入口，降级提示 |
| Redis故障 | 中 | state验证失败 | 本地缓存降级方案 |
| 安全漏洞 | 高 | 用户数据泄露 | 代码审计，渗透测试 |

### 10.2 外部依赖

| 依赖方 | 依赖内容 | 负责人 | 交付时间 |
|--------|---------|--------|---------|
| 主系统团队 | OAuth接口文档 | TBD | TBD |
| 主系统团队 | 测试环境授权端点 | TBD | TBD |
| 运维团队 | HTTPS证书配置 | TBD | TBD |
| 安全团队 | 安全审计 | TBD | TBD |

---

## 十一、里程碑

| 里程碑 | 日期 | 交付物 | 验收标准 |
|--------|------|--------|---------|
| M1: 设计评审 | D+3 | PRD文档、技术方案 | 评审通过 |
| M2: 后端开发完成 | D+7 | 后端接口、单元测试 | 接口可调通 |
| M3: 前端开发完成 | D+10 | 前端页面、组件 | 功能可演示 |
| M4: 联调完成 | D+12 | 集成测试报告 | 主流程通过 |
| M5: UAT验收 | D+14 | UAT报告 | 验收通过 |
| M6: 上线 | D+15 | 生产环境部署 | 监控正常 |

---

## 十二、开发常见问题

### Q1: 主系统返回的用户信息字段不匹配怎么办？

**A**: 在OAuth Service中实现字段映射层，将主系统字段映射为本地字段。配置化处理，便于后续调整。

### Q2: 用户在主系统修改了信息，子系统如何同步？

**A**: 
- 方案一：每次登录时同步最新信息（推荐）
- 方案二：提供Webhook接收主系统变更通知（V1.1规划）

### Q3: 如何处理用户在多个主系统账号的情况？

**A**: 当前版本只支持单一主系统绑定，V1.1版本规划多账号绑定与解绑功能。

### Q4: Token刷新失败如何处理？

**A**: 刷新失败时清除本地登录状态，引导用户重新授权登录。

### Q5: 如何保证授权码不被截获重放？

**A**: 
1. code一次性使用，使用后立即失效
2. code有效期短（10分钟）
3. 可选实现PKCE扩展，增加code_verifier验证

---

## 附录A：OAuth 2.0 授权码流程图

```
+----------+                                   +----------+
|          |                                   |          |
|  用户    |                                   |  主系统  |
|          |                                   |          |
+----+-----+                                   +----+-----+
     |                                              |
     | 1. 点击"一键登录"                             |
     v                                              |
+----+-----+                                   +----+-----+
|          |  2. 获取授权URL                      |          |
| 子系统   |----------------------------------->|          |
| 前端     |                                   |          |
+----+-----+                                   +----+-----+
     |                                              |
     | 3. 重定向至授权页面                           |
     |--------------------------------------------->|
     |                                              |
     |                                 4. 用户确认授权
     |                                              |
     | 5. 回调（携带code + state）                   |
     |<---------------------------------------------|
     |                                              |
     | 6. 验证state                                 |
     | 7. code换取token                             |
     |--------------------------------------------->|
     |                                              |
     | 8. 返回access_token                          |
     |<---------------------------------------------|
     |                                              |
     | 9. 获取用户信息                               |
     |--------------------------------------------->|
     |                                              |
     | 10. 返回用户信息                              |
     |<---------------------------------------------|
     |                                              |
     | 11. 创建/更新本地用户                         |
     | 12. 生成本地JWT Token                        |
     | 13. 完成登录                                  |
     v                                              |
+----+-----+                                        |
| 工作台   |                                        |
+----------+                                        |
```

---

## 附录B：配置项清单

| 配置项 | 环境变量 | 说明 | 示例值 |
|--------|---------|------|--------|
| OAuth客户端ID | OAUTH_CLIENT_ID | 主系统分配 | business-planner |
| OAuth客户端密钥 | OAUTH_CLIENT_SECRET | 主系统分配 | xxx |
| 授权端点 | OAUTH_AUTHORIZE_URL | 主系统授权页 | https://main.com/oauth/authorize |
| Token端点 | OAUTH_TOKEN_URL | Token交换 | https://main.com/oauth/token |
| 用户信息端点 | OAUTH_USERINFO_URL | 获取用户信息 | https://main.com/oauth/userinfo |
| 回调地址 | OAUTH_REDIRECT_URI | 子系统回调 | https://planner.com/auth/callback |
| Token加密密钥 | TOKEN_ENCRYPT_SECRET | 32字节密钥 | (随机生成) |

---

**文档结束**
