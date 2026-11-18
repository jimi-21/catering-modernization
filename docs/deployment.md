# 部署与上线检查

## 准备

1. 一台安装 Docker 与 Docker Compose 的 Linux 服务器。
2. 域名 DNS 已指向服务器，防火墙和云安全组开放 80、443。
3. 保留原域名与备案主体的服务器/接入配置，由域名与备案负责人确认，不在代码中修改。
4. 生成独立高强度 `AUTH_SECRET`、`POSTGRES_PASSWORD` 和 `ADMIN_PASSWORD`。数据库密码建议使用 `openssl rand -hex 32` 生成纯十六进制值，避免连接 URL 中的特殊字符编码问题。

## 配置

复制 `.env.example` 为 `.env`，设置：

```dotenv
POSTGRES_PASSWORD=replace-with-a-random-database-password
AUTH_SECRET=replace-with-a-random-secret-at-least-32-characters
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=replace-with-a-strong-admin-password
DOMAIN=www.example.com
NEXT_PUBLIC_SITE_URL=https://www.example.com
```

Compose 内部使用 `db:5432` 构造 PostgreSQL 连接串，不需要在宿主机暴露数据库端口。

## 启动

```bash
docker compose up --build -d
docker compose ps
docker compose logs migrate
docker compose logs web
```

`migrate` 服务先执行 PostgreSQL migration、幂等种子脚本和旧内容迁移，成功退出后 Web 才启动。种子与迁移默认只创建缺失内容，不覆盖后台后续编辑。Caddy 自动申请、续期证书并将 HTTP 跳转到 HTTPS。

上传文件、PostgreSQL 和 Caddy 证书分别使用独立 Docker volume。升级前备份这些 volume。

数据库逻辑备份可使用：

```bash
docker compose exec -T db pg_dump -U hengshan -d hengshan > hengshan-backup.sql
```

备份包含账号与咨询数据，应加密保存并定期在隔离数据库中验证恢复。

## 上线验收

- `https://域名` 返回 200，HTTP 自动跳转到 HTTPS，证书链有效。
- 首页、服务、案例、文章和自定义页面均可访问，手机端无横向溢出。
- 旧链接逐个抽样，确认状态为 301 且目标正确；未知旧 ID 不应跳转到无关页面。
- `sitemap.xml` 使用生产绝对 URL，`robots.txt` 不包含测试环境地址。
- 后台 Cookie 在生产为 Secure，演示默认密码已替换。
- 上传一张封面并重启 Web，确认文件仍存在。
- 提交一条测试咨询并在后台处理，随后按隐私规则删除。
- 确认真实品牌、联系方式、案例、资质与备案信息替换全部演示内容。

## 回滚

保留上一个可用镜像和数据库备份。数据库迁移与回滚必须单独评审，不能用覆盖数据库的方式处理代码回滚。上线前在 staging 完整执行一次迁移、E2E 和恢复演练。
