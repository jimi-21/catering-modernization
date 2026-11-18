# 架构与安全

## 总体结构

应用采用 Next.js App Router，公共页面与后台使用不同布局。内容、用户与咨询由 Prisma 访问数据库；本地开发使用 SQLite，生产使用 PostgreSQL，两种模型保持相同字段。

```text
Browser → Caddy (HTTPS) → Next.js → Prisma → PostgreSQL
                              └────→ persistent uploads
Legacy URL → Proxy mapping → HTTP 301 → canonical content URL
```

公共数据库页面使用动态渲染，确保 CMS 发布后读取最新状态；变更后同时重新验证相关缓存路径。静态服务资料由 `src/lib/site.ts` 统一维护。

## 内容模型

`Content` 使用受 Zod 约束的字符串字段表示类型、模板和发布状态，避免 SQLite 与 PostgreSQL 的枚举能力差异。`slug` 全局唯一，保留跨类型误用检查。发布时写入首次发布时间，撤回草稿会清除发布时间。

正文使用 Markdown，由 `react-markdown` 渲染且不启用原始 HTML，避免后台存储型 XSS；文中一级标题会降级，保持每个页面一个主标题。内容类型与 slug 创建后不可修改，防止编辑操作意外破坏公开 URL。所有 mutation 都在服务端重新鉴权和校验，浏览器约束只用于改善填写体验。

## 认证与会话

- 密码使用 Node.js `scrypt` 和随机盐哈希，比较时使用 `timingSafeEqual`。
- 会话为带过期时间的 HMAC-SHA256 签名 token，写入 HttpOnly、SameSite=Lax Cookie；生产启用 Secure。
- 每个后台布局与每个 Server Action 都执行鉴权，并重新查询账号是否仍存在且角色为 ADMIN；删除或降级账号后，旧会话立即失效。
- 登录失败按 IP 与邮箱限流，错误信息不区分账号是否存在。
- 公开咨询按代理链末端 IP 限流；蜜罐内容直接返回成功但不入库。
- 限流存储有最大条目数并清理过期记录，避免唯一键攻击造成内存无限增长。
- 进程内限流不适合多实例；生产扩容时使用共享限流存储。

## CSRF 与网络安全

变更操作使用 Next.js Server Actions，由框架校验同源请求。全站 CSP 使用每次请求随机 nonce、`strict-dynamic`，并限制 `object-src`、`base-uri`、`form-action` 和 `frame-ancestors`。开发模式仅为热更新放宽 `connect-src` 与 `unsafe-eval`。

Caddy 负责 TLS、HTTP 到 HTTPS 跳转和 HSTS。应用不修改域名或备案信息，这些属于部署方的既有基础设施。

## 上传安全

上传入口限制为 3 MB，接受 JPG、PNG、WebP。服务端不依赖浏览器声明的 MIME，而是检查二进制签名，真实解码并限制输入像素，去除元数据、按 EXIF 方向旋转、缩放后统一编码为 WebP。文件使用 UUID 命名，不信任原文件名。替换或删除内容会清理旧上传，保存失败会回收新文件。

读取接口只匹配严格的 UUID 文件名格式，防止路径穿越，并设置 `nosniff` 与不可变缓存。

生产上传目录挂载持久化 volume。多实例或 Serverless 部署应替换为 S3 兼容对象存储，并接入病毒扫描和图片尺寸复核。

## 数据与隐私

咨询表单包含隐藏 honeypot、长度限制与服务端校验。演示不会发送外部通知，也不应填写真实敏感数据。正式上线需补充隐私政策、数据保留周期、访问审计与备份恢复流程。

## 质量保障

- Vitest：迁移规则、URL 规范化、密码哈希、会话签名、输入校验。
- Playwright：桌面/手机端导航、搜索、真实 301、SEO 端点、咨询入库、CMS 完整生命周期。
- axe-core：全部公共页面、登录页、后台概览、内容列表、编辑器与咨询页的 WCAG A/AA 自动检查。
- CI：格式、Lint、类型检查、单元测试、生产构建，以及 Chromium、Firefox、WebKit 的桌面/手机端 E2E 全部通过后合入。
