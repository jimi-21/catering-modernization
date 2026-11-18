# 旧站迁移策略

## 原则

迁移先保留证据，再清理内容。原始导出只读，脚本可重复执行；每条记录都有明确的导入或跳过原因。真实项目应先备份数据库，在 staging 运行，由业务方确认清理规则。

## 流程

1. 将旧 CMS 导出转换为 `legacy/export.json` 的结构。
2. 运行 `npm run migrate:legacy -- --dry-run`，检查报告。
3. 根据业务确认调整无关类目关键词和映射。
4. 在测试数据库执行 `npm run migrate:legacy`。
5. 核对内容数量、抽样正文、图片和旧链接 301。
6. 生产执行后保留报告与原始导出，持续监测 404 和搜索收录。

## 当前规则

- 类目或标题命中养生、健康、中医、美容、减肥、保健、疾病、食疗：`SKIP_OUT_OF_SCOPE`。
- 规范化标题重复，或去除空白/标点后的正文 SHA-256 重复：`SKIP_DUPLICATE`。
- 类目包含案例/项目：导入为案例并使用专题模板。
- 其余业务内容：导入为文章并使用标准模板。
- 缺少英文 slug：生成稳定的 `legacy-{旧ID}`。
- 导入默认使用“同 slug 仅创建、不更新”的策略，重复执行不会覆盖后台已编辑内容；只有显式传入 `--overwrite` 才允许覆盖。
- 数据库导入在一个事务中执行，单条写入失败会回滚本批操作。
- 非法日期、过短正文、重复旧 URL 等问题会进入报告；slug 冲突自动追加旧 ID，避免互相覆盖。

规则只用于演示。真实项目不能只依赖关键词自动删除，应由人工复核边界内容。

## 重定向

`legacy/redirects.generated.json` 保存完整旧 URL 与新 URL。`src/lib/legacy-redirects.ts` 精确匹配路径及旧 URL 中列出的查询参数，`src/proxy.ts` 返回 HTTP 301。

例如：

```text
/plus/view.php?aid=101 → /insights/canteen-opening-week
/a/supply/102.html → /insights/delivery-exception-workflow
/plus/view.php?aid=103 → /cases/campus-peak-flow-demo
```

被过滤或判定为重复的内容不会自动重定向到无关文章。真实项目如确认重复内容已有权威目标，可在人工复核后添加映射。

## 输出

`reports/legacy-migration.json` 包含总数、导入数、重复数、无关内容数和逐条决定。该报告是验收材料，不代替数据库备份或线上监控。
