# AGENTS.md - AI 开发规范

> 本文件定义了本项目的开发规范，供所有 AI 编码助手参考遵循。

---

## 一、项目概述

**项目名称**：胡镕的个人作品集网站  
**项目类型**：纯前端静态网站  
**目标平台**：Cloudflare Pages / Vercel  
**核心功能**：
- 前台单页式作品集展示（Hero、关于我、教育、项目、活动、联系方式）
- 特色功能：双主题切换、滚动动画、3D效果、粒子背景、音乐播放器、访客统计
- 后台管理 `/admin`：登录后可在线编辑所有内容，数据存储在 localStorage

---

## 二、技术栈硬性约定

| 约定 | 值 |
|------|-----|
| HTML版本 | HTML5（语义化标签优先） |
| CSS | 原生 CSS3，使用 CSS 变量实现主题 |
| JavaScript | ES6+ 原生语法，不使用任何前端框架 |
| 构建工具 | 不使用（纯静态） |
| 包管理 | 不使用 npm/yarn（CDN 引入依赖） |
| 外部依赖 | Font Awesome 6（图标）、Google Fonts（字体） |
| 数据存储 | localStorage 模拟后端 |
| 部署 | Cloudflare Pages 或 Vercel |

---

## 三、目录结构约定

**必须严格遵循以下目录结构，不得随意变更**：

```
根目录/
├── PRD.md              # 产品需求文档（不可删除）
├── TECH_DESIGN.md      # 技术设计文档（不可删除）
├── AGENTS.md           # 本文件（不可删除）
├── index.html          # 前台首页
├── admin.html          # 后台管理页面
├── css/
│   ├── style.css       # 全局基础样式 + 重置
│   ├── theme.css       # 主题变量（浅/深）
│   ├── components.css  # 通用组件样式
│   └── admin.css       # 后台专用样式
├── js/
│   ├── main.js         # 前台入口
│   ├── api.js          # 模拟API
│   ├── theme.js        # 主题切换
│   ├── animations.js   # 动画效果
│   ├── music.js        # 音乐播放器
│   ├── counter.js      # 访客统计
│   ├── carousel.js     # 图片轮播
│   └── admin.js        # 后台逻辑
├── assets/
│   ├── avatar.png      # 头像占位
│   ├── resume.pdf      # 简历下载
│   ├── images/         # 项目/活动图片
│   └── audio/          # 背景音乐
└── data/
    └── default.json    # 默认数据
```

---

## 四、代码风格

### 4.1 HTML
- 使用语义化标签：`<header>` `<nav>` `<main>` `<section>` `<article>` `<footer>`
- 每个 section 添加 `id` 属性用于锚点跳转
- class 命名使用 kebab-case：`hero-section` `card-item` `project-grid`
- 重要元素添加 aria-label

### 4.2 CSS
- 所有颜色必须使用 CSS 变量（定义在 `css/theme.css`）
- 禁止在组件文件中硬编码颜色值（如 `#FF8A9E`）
- 响应式使用 CSS Grid / Flexbox
- 动画使用 `transform` 和 `opacity`（性能好）
- 3D 效果必须添加 `transform-style: preserve-3d`
- 媒体查询断点：
  ```css
  @media (max-width: 768px) { /* 移动端 */ }
  @media (min-width: 769px) and (max-width: 1024px) { /* 平板 */ }
  @media (min-width: 1025px) { /* 桌面 */ }
  ```

### 4.3 JavaScript
- 使用 `const` / `let`，禁止 `var`
- 所有 API 函数返回 Promise
- 函数命名使用 camelCase
- 每个函数单一职责
- DOM 操作等待 `DOMContentLoaded` 后执行
- 错误处理使用 try-catch

---

## 五、配色硬性约束

**禁止使用以下同质化配色**：
- 蓝紫渐变（`linear-gradient(blue, purple)`）
- 黑白灰极简风
- 纯科技蓝（#0066FF 等）

**必须使用以下自定义配色（定义在 theme.css）**：

浅色主题：
```
珊瑚粉 #FF8A9E（主色）
薄荷青 #7FD1C7（辅色）
落日橙 #FFB088（点缀）
深墨蓝 #2D3A4B（文字）
奶油白 #FAF7F2（背景）
珍珠米 #FFFDF8（卡片）
```

暗色主题：
```
霓虹珊瑚 #FF6B8A（主色）
幽绿 #5BB8AF（辅色）
深夜蓝 #0F1923（背景）
暗岩灰 #1A2533（卡片）
月白 #E8E6E1（文字）
```

---

## 六、Git 提交规范

> 如果项目使用 Git，遵循以下规则：

每次完成一个功能模块后提交：
```
feat: 实现滚动进入动画
feat: 添加暗色主题切换
fix: 修复移动端导航栏溢出问题
style: 调整卡片圆角和阴影
refactor: 抽取通用 API 函数
```

**严禁**：把所有改动攒到一起提交。

---

## 七、质量检查清单

完成代码后，AI 必须自行检查：

- [ ] HTML 结构完整，无未闭合标签
- [ ] CSS 颜色全部使用变量
- [ ] 移动端响应式正常（模拟 375px 宽度查看）
- [ ] 主题切换后所有元素颜色正确变化
- [ ] 滚动动画不卡顿（60fps）
- [ ] 3D 卡片效果无闪烁
- [ ] 后台登录功能正常
- [ ] localStorage 读写无报错
- [ ] 无明显的 console 错误

---

## 八、开发节奏

遵循"三步开发策略"：

1. **先跑通骨架** — 所有 section 有基本结构，数据能加载显示
2. **再填充细节** — 样式打磨、动画效果、交互完善
3. **最后优化体验** — 性能调优、边界处理、响应式适配

---

## 九、Bug 排查约定

遇到 Bug 时按以下顺序：

1. 打开浏览器开发者工具 Console 查看报错
2. 检查 Network 面板（虽然是纯前端，也看看资源加载）
3. 确认是哪个 section 出问题，单点修改
4. 若不确定，使用二分排查法：先注释一半代码看有没有问题
5. 修改后立即刷新验证，避免多次修改叠加难以定位

---

## 十、部署相关

部署到 Cloudflare Pages：
1. 创建 Pages 项目 → Direct Upload
2. 把整个项目文件上传
3. 无构建命令，无输出目录配置
4. 自动分配 `*.pages.dev` 子域名

部署到 Vercel：
1. Import Project → 选择目录
2. Framework Preset 选 "Other"
3. Build Command 留空
4. Output Directory 填 `.`
5. 自动分配 `*.vercel.app` 子域名
