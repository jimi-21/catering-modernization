import { PrismaClient } from "@prisma/client";
import { hashPassword } from "../src/lib/password";
import { loginSchema } from "../src/lib/validation";

const db = new PrismaClient();

const cases = [
  {
    kind: "CASE",
    template: "FEATURE",
    status: "PUBLISHED",
    title: "制造产业园：让高峰期供餐更有秩序",
    slug: "manufacturing-campus-canteen",
    excerpt: "围绕多班次就餐与峰值排队问题，重新组织菜单、动线和现场分工。",
    category: "食堂运营",
    coverImage: "/images/dining-space.webp",
    coverAlt: "宽敞有序的园区用餐空间",
    seoTitle: "制造产业园食堂运营方案｜演示案例",
    seoDescription: "展示多班次园区食堂从调研、方案设计到日常复盘的改造路径。",
    publishedAt: new Date("2026-10-12T08:00:00.000Z"),
    body: `> 本案例为虚构演示，用于呈现项目方案的内容结构与展示方式。

## 项目背景

园区存在班次集中、就餐时间窗口短的特点。改造重点不是简单增加菜品，而是同步梳理产能、动线与现场协作。

## 方案重点

- 按班次拆分供餐节奏，提前确认每餐预计人数。
- 将常用套餐与特色窗口分开组织，减少选择造成的停留。
- 明确备餐、补餐和机动岗位，避免高峰期相互等待。
- 每日记录剩余餐量与现场反馈，作为下一周菜单调整依据。

## 交付内容

项目方案包含现场调研清单、岗位分工表、周期菜单模板、高峰期应急预案和运营日报样例。`,
  },
  {
    kind: "CASE",
    template: "FEATURE",
    status: "PUBLISHED",
    title: "写字楼餐厅：在有限空间里改善体验",
    slug: "office-dining-experience",
    excerpt: "以菜品结构和空间节奏为切入点，兼顾午间效率与日常用餐感受。",
    category: "团餐设计",
    coverImage: "/images/meal-balanced.webp",
    coverAlt: "搭配均衡的主食、蔬菜和蛋白质餐盘",
    seoTitle: "写字楼员工餐厅体验优化｜演示案例",
    seoDescription: "通过菜单分层、空间节奏与反馈机制改善写字楼员工餐厅体验。",
    publishedAt: new Date("2026-09-08T08:00:00.000Z"),
    body: `> 本案例为虚构演示，不代表真实客户项目。

## 从需求而不是风格开始

写字楼餐厅需要同时回应午间效率、菜品变化和预算约束。方案先定义高频就餐者的核心需求，再决定空间与菜单的调整优先级。

## 三项改进

1. 用基础套餐保证高峰效率，用周期特色菜增加变化。
2. 将取餐、结账与回收动线放在同一张现场图中复核。
3. 用简短的多选题收集反馈，并按菜品而不是笼统评分归类。

## 持续复盘

每四周形成一次菜单复盘，保留高满意度菜品，调整低选中率菜品，并记录调整原因。`,
  },
  {
    kind: "CASE",
    template: "FEATURE",
    status: "PUBLISHED",
    title: "校园后厨：把验收与台账放进同一流程",
    slug: "campus-kitchen-traceability",
    excerpt: "从采购到入库建立统一记录，让食材批次、验收结果和异常处理彼此关联。",
    category: "食材供应",
    coverImage: "/images/produce-market.webp",
    coverAlt: "新鲜蔬菜按品类分区陈列",
    seoTitle: "校园食堂食材验收与追溯流程｜演示案例",
    seoDescription: "展示食材采购、到货验收、批次台账与异常处理的完整流程。",
    publishedAt: new Date("2026-08-16T08:00:00.000Z"),
    body: `> 本案例为虚构演示，用于说明食材追溯内容如何呈现。

## 流程梳理

将采购订单、供应商批次、到货验收和入库记录使用同一编号关联，减少纸质信息分散造成的查找成本。

## 验收清单

- 核对品项、数量、规格与订单是否一致。
- 检查外观、温度、保质期及随附票据。
- 对不合格项拍照登记，明确拒收或替换结果。
- 每日完成台账复核，避免事后集中补录。

## 异常闭环

异常记录不仅描述问题，也保留处理人、处理结果和后续预防措施，让追溯真正服务日常管理。`,
  },
];

const articles = [
  {
    kind: "ARTICLE",
    template: "STANDARD",
    status: "PUBLISHED",
    title: "食堂交接时，最值得核对的五张清单",
    slug: "canteen-handover-checklists",
    excerpt: "场地设备、食材库存、人员信息、供应商资料和食安记录，建议逐项确认并双方签字。",
    category: "运营方法",
    coverImage: "/images/kitchen-team.webp",
    coverAlt: "后厨工作人员在餐厅内",
    seoTitle: "食堂交接清单：设备、库存、人员与食安资料",
    seoDescription: "一份结构清晰的食堂交接核对指南，帮助减少运营主体切换时的信息遗漏。",
    publishedAt: new Date("2026-10-20T08:00:00.000Z"),
    body: `食堂交接不是简单的钥匙移交。缺少清单的交接，容易把设备状态、库存差异和历史遗留问题带进新周期。

## 场地与设备清单

逐项记录设备编号、数量、状态和维修情况。对冷藏、消毒和燃气相关设备，应在现场实际运行后确认。

## 库存与供应商清单

库存需要同时记录数量、批次和保质期。供应商资料则应包括联系方式、合同边界、资质文件与未结事项。

## 人员与运营清单

明确岗位、排班、健康证明和待办事项。既有投诉、满意度结果和改进计划也应纳入交接，避免服务经验中断。

## 食安记录清单

留样、消毒、巡检和培训记录按时间顺序整理。发现缺项时如实标记，不用事后补写代替真实记录。

## 双方确认

所有差异都应进入问题清单，写明责任人和确认期限。清单的价值不在于形式完整，而在于后续能够追查。`,
  },
  {
    kind: "ARTICLE",
    template: "STANDARD",
    status: "PUBLISHED",
    title: "周期菜单如何兼顾营养、口味与成本",
    slug: "cycle-menu-planning",
    excerpt: "先建立菜品库，再通过周期轮换和反馈复盘，让菜单管理摆脱重复与临时决定。",
    category: "菜单管理",
    coverImage: "/images/meal-balanced.webp",
    coverAlt: "颜色丰富、搭配均衡的一份餐食",
    seoTitle: "周期菜单设计方法：营养、口味与成本平衡",
    seoDescription: "从菜品库、营养结构、季节替换与反馈复盘四个层面设计食堂周期菜单。",
    publishedAt: new Date("2026-09-26T08:00:00.000Z"),
    body: `周期菜单不是把四周菜品一次性排满，而是建立一套能够持续调整的决策框架。

## 先建立结构化菜品库

每道菜至少记录主要食材、口味、加工方式、参考成本与适用场景。信息完整后，菜单编排才有可靠基础。

## 再看一天的组合

单道菜的营养信息不能代表整餐体验。应把主食、蛋白、蔬菜和汤品放在一起检查，同时留意颜色、口感和加工方式是否过于重复。

## 用替换规则应对波动

提前为关键食材设置可替换品项，并明确替换后的口味和成本边界，降低临时采购对菜单的影响。

## 把反馈变成下一轮输入

结合选中率、剩菜情况和用餐者意见复盘。保留有效菜品，记录调整原因，让菜单随着真实使用情况迭代。`,
  },
  {
    kind: "ARTICLE",
    template: "STANDARD",
    status: "PUBLISHED",
    title: "食材验收不是看一眼：一份可执行的现场流程",
    slug: "ingredient-acceptance-workflow",
    excerpt: "从订单核对到异常处理，把验收拆成明确动作，减少凭经验和事后补记录。",
    category: "食安管理",
    coverImage: "/images/produce-market.webp",
    coverAlt: "市场内分类陈列的蔬菜",
    seoTitle: "食材到货验收流程与异常处理清单",
    seoDescription: "介绍食材验收中的订单核对、品质检查、批次记录与异常闭环。",
    publishedAt: new Date("2026-08-30T08:00:00.000Z"),
    body: `验收是采购与后厨之间的关键控制点。流程越清楚，现场越不依赖某一位员工的个人经验。

## 到货前准备

提前取得当日订单和供应商送货信息，准备验收区域、计量工具与记录表。特殊储运要求的食材应优先处理。

## 现场核对

先核对订单与品项，再检查数量、规格、外观、温度和保质期。检查结果应当即时记录，而不是等全天收货结束后补写。

## 异常处理

对不符合要求的食材明确隔离，记录问题、数量和证据，并确认退换结果。未经确认的异常食材不应直接进入加工区。

## 每日复核

将订单、验收和退换记录统一归档。管理人员抽查记录与实物批次是否对应，确保台账不是孤立表格。`,
  },
  {
    kind: "ARTICLE",
    template: "STANDARD",
    status: "PUBLISHED",
    title: "厨房动线改造，先从一张现状图开始",
    slug: "kitchen-workflow-assessment",
    excerpt: "把收货、储存、加工、备餐与回收画在同一张图上，问题往往比设备清单更早显现。",
    category: "空间规划",
    coverImage: "/images/chef-service.webp",
    coverAlt: "厨师在后厨进行餐食制作",
    seoTitle: "厨房动线规划：从现状图到改造清单",
    seoDescription: "通过现状动线图识别厨房交叉、折返和空间瓶颈，形成分优先级的改造清单。",
    publishedAt: new Date("2026-07-18T08:00:00.000Z"),
    body: `厨房改造不应从购买设备开始，而应从理解真实工作过程开始。

## 记录完整流程

在一个完整餐次中跟随原料和餐具，记录每个停点、转折和等待。用平面图标注收货、储存、加工、备餐和回收路径。

## 找到真正的瓶颈

交叉污染风险、重复搬运和高峰等待需要分开判断。有些问题通过调整岗位与摆放即可改善，不必先做大规模施工。

## 建立改造优先级

优先处理食安风险和高频低效，再评估产能提升与体验优化。每项改造写清预期结果，便于交付后验证。

## 保留复核环节

投入使用后再次绘制实际动线，对比方案与现场的差异。设计图纸只有转化为稳定操作，才算真正完成。`,
  },
];

const pages = [
  {
    kind: "PAGE",
    template: "FEATURE",
    status: "PUBLISHED",
    title: "食品安全与质量管理说明",
    slug: "food-safety-policy",
    excerpt: "公开我们的演示食安管理框架：供应商准入、到货验收、过程检查、留样与异常闭环。",
    category: "专题页面",
    coverImage: "/images/hero-kitchen.webp",
    coverAlt: "厨房内协同准备餐食",
    seoTitle: "食品安全与质量管理框架",
    seoDescription: "衡膳演示项目的食品安全与质量管理框架说明。",
    publishedAt: new Date("2026-10-01T08:00:00.000Z"),
    body: `本页面用于演示 CMS 自定义专题模板，不代表虚构品牌的真实资质或承诺。

## 供应商准入

建立资料审核与定期复核机制，记录供应品类、资质有效期和异常历史。

## 到货与储存

以订单为依据完成品质、数量和批次核对，按照品类要求储存并保留异常处理结果。

## 加工与出品

通过岗位操作标准、现场巡检和餐食留样记录控制关键环节。

## 反馈与改进

将投诉、满意度与日常检查纳入同一改进清单，明确责任人和完成期限。`,
  },
];

async function main() {
  const email = (process.env.ADMIN_EMAIL ?? "admin@hengshan.demo").trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD ?? "Demo!2026";
  const credentials = loginSchema.parse({ email, password });
  await db.user.upsert({
    where: { email },
    update: {},
    create: {
      email,
      name: "内容管理员",
      role: "ADMIN",
      passwordHash: await hashPassword(credentials.password),
    },
  });

  for (const item of [...cases, ...articles, ...pages]) {
    await db.content.upsert({
      where: { slug: item.slug },
      update: {},
      create: item,
    });
  }

  console.log(
    `Ensured ${cases.length + articles.length + pages.length} seed entries and admin ${email}; existing content was preserved.`,
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => db.$disconnect());
