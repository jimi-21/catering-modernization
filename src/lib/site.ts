import { CookingPot, Leaf, LayoutDashboard, Truck, type LucideIcon } from "lucide-react";

export const site = {
  name: "衡膳餐饮",
  shortName: "衡膳",
  englishName: "HENGSHAN CATERING",
  description:
    "面向企事业单位的食堂承包、团餐运营、食材配送与厨房设计服务。以标准化流程和透明台账，守住每一餐的品质。",
  serviceArea: "惠州 · 惠阳 · 大亚湾 · 惠城",
  phone: "0752-0000 000",
  email: "hello@hengshan.demo",
  address: "广东省惠州市（演示地址）",
};

export function getSiteUrl() {
  return (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/+$/, "");
}

export const navigation = [
  { href: "/", label: "首页" },
  { href: "/services", label: "服务能力" },
  { href: "/cases", label: "项目案例" },
  { href: "/insights", label: "食安观察" },
  { href: "/about", label: "关于衡膳" },
] as const;

export type Service = {
  slug: string;
  title: string;
  eyebrow: string;
  summary: string;
  description: string;
  image: string;
  imageAlt: string;
  icon: LucideIcon;
  features: string[];
  steps: { title: string; description: string }[];
};

export const services: Service[] = [
  {
    slug: "canteen-operation",
    title: "企事业单位食堂承包",
    eyebrow: "CANTEEN OPERATION",
    summary: "从菜单、人员到现场管理，建立可持续的食堂运营机制。",
    description:
      "围绕就餐人数、班次与预算设计供餐方案，以标准化操作、日常巡检和意见反馈形成运营闭环。",
    image: "/images/dining-space.webp",
    imageAlt: "明亮整洁的用餐空间",
    icon: CookingPot,
    features: ["按需定制供餐模式", "菜单与成本双线管理", "驻场团队岗位培训", "满意度回访与改进"],
    steps: [
      { title: "现场调研", description: "核对场地、设备、餐次、人数与既有流程。" },
      { title: "方案测算", description: "形成菜单结构、人员配置和费用边界清晰的方案。" },
      { title: "进场交接", description: "按清单完成设备、物料、人员和食安资料交接。" },
      { title: "持续运营", description: "以日报、巡检和回访记录推动持续改进。" },
    ],
  },
  {
    slug: "ingredient-delivery",
    title: "食材蔬菜配送",
    eyebrow: "INGREDIENT SUPPLY",
    summary: "让采购、验收和配送有记录，让每一批食材有出处。",
    description:
      "以订单协同、供应商管理、到货验收和异常追溯为主线，为食堂及餐饮门店提供稳定的食材供应。",
    image: "/images/produce-market.webp",
    imageAlt: "分类摆放的新鲜蔬菜",
    icon: Truck,
    features: ["供应商准入审核", "批次与票据留存", "到货品质验收", "缺货替换沟通机制"],
    steps: [
      { title: "需求汇总", description: "按餐次与库存生成采购清单，减少临时补货。" },
      { title: "分拣复核", description: "按品类和订单分拣，核对数量与品质。" },
      { title: "按时配送", description: "规划路线与交付时间，保留批次记录。" },
      { title: "验收闭环", description: "异常现场反馈，明确退换与责任处理。" },
    ],
  },
  {
    slug: "kitchen-design",
    title: "厨房规划与设计",
    eyebrow: "KITCHEN PLANNING",
    summary: "从人流动线出发，让空间、设备与供餐效率协同。",
    description:
      "结合场地条件与供餐目标，梳理收货、仓储、加工、烹饪、备餐和回收流程，减少交叉与返工。",
    image: "/images/kitchen-team.webp",
    imageAlt: "餐饮后厨工作人员",
    icon: LayoutDashboard,
    features: ["现场条件复核", "功能分区建议", "设备选型清单", "施工衔接与验收"],
    steps: [
      { title: "需求定义", description: "明确供餐规模、餐品结构和未来扩展空间。" },
      { title: "动线规划", description: "围绕人流、物流和洁污分流组织空间。" },
      { title: "设备配置", description: "按实际产能选择设备，避免过度投入。" },
      { title: "交付复核", description: "依据图纸与使用场景逐项验收。" },
    ],
  },
  {
    slug: "nutrition-management",
    title: "营养与菜单管理",
    eyebrow: "MENU MANAGEMENT",
    summary: "兼顾口味、营养与成本，让每周菜单不再凭经验重复。",
    description: "根据人群结构、季节食材和反馈数据调整菜单，以菜品库和周期复盘提升就餐体验。",
    image: "/images/meal-balanced.webp",
    imageAlt: "主食、蛋白质与蔬菜搭配的餐盘",
    icon: Leaf,
    features: ["周期菜单编排", "菜品结构复核", "季节食材替换", "剩菜与反馈复盘"],
    steps: [
      { title: "人群分析", description: "了解年龄、班次、口味与特殊用餐需求。" },
      { title: "菜单编排", description: "平衡主食、蛋白、蔬菜和汤品的搭配。" },
      { title: "试餐校准", description: "通过试餐确认份量、口味和出品稳定性。" },
      { title: "周期复盘", description: "结合反馈和剩菜情况调整菜品库。" },
    ],
  },
];
