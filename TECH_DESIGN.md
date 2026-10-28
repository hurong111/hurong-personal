# 个人作品集网站 技术设计文档

> 版本：v1.0  
> 作者：胡镕  
> 创建日期：2026-10-27

---

## 一、技术栈选型

### 1.1 核心技术

| 类别 | 技术 | 版本 | 选型理由 |
|------|------|------|----------|
| HTML | HTML5 | - | 语义化标签，SEO友好 |
| CSS | CSS3 + 原生变量 | - | 支持主题切换变量系统 |
| JavaScript | ES6+ 原生 | - | 无构建工具，直接运行 |
| 存储 | localStorage | - | 模拟后端接口，无需服务器 |

### 1.2 外部依赖（CDN引入）

| 库 | 用途 | 引入方式 |
|----|------|----------|
| Font Awesome 6 | 图标 | CDN |
| Google Fonts | 手写装饰字体 | CDN |
| Canvas API | 粒子背景 | 浏览器原生，无需引入 |
| CSS 3D Transform | 3D卡片效果 | 浏览器原生 |

### 1.3 部署方案
- **目标平台**：Cloudflare Pages 或 Vercel（二选一）
- **构建方式**：纯静态文件，无需构建命令
- **部署方式**：直接上传或关联GitHub仓库

---

## 二、目录结构

```
e:\零代码平台1\
├── PRD.md                      # 产品需求文档
├── TECH_DESIGN.md              # 技术设计文档
├── AGENTS.md                   # AI开发规范
│
├── index.html                  # 前台首页
├── admin.html                  # 后台管理页面
│
├── css/
│   ├── style.css               # 全局样式（含变量、重置、通用类）
│   ├── theme.css               # 主题变量（浅色/暗色）
│   ├── components.css          # 组件样式（卡片、按钮、导航等）
│   └── admin.css               # 后台管理专用样式
│
├── js/
│   ├── main.js                 # 前台入口（初始化、路由）
│   ├── api.js                  # 模拟API封装（localStorage操作）
│   ├── theme.js                # 主题切换逻辑
│   ├── animations.js           # 滚动动画、粒子效果
│   ├── music.js                # 音乐播放器
│   ├── counter.js              # 访客统计
│   ├── carousel.js             # 图片轮播
│   └── admin.js                # 后台管理逻辑
│
├── assets/
│   ├── avatar.png              # 头像占位（预留）
│   ├── resume.pdf              # 简历下载（预留）
│   ├── images/                 # 项目/活动图片
│   └── audio/                  # 背景音乐（预留）
│
└── data/
    └── default.json            # 默认数据（首次加载时写入localStorage）
```

---

## 三、数据结构设计

### 3.1 localStorage Key 设计

| Key | 类型 | 描述 |
|-----|------|------|
| `hr_site_profile` | Object | 个人基本信息 |
| `hr_site_education` | Array | 教育经历列表 |
| `hr_site_projects` | Array | 项目列表 |
| `hr_site_activities` | Array | 校内活动列表 |
| `hr_site_blog` | Array | 博客文章列表 |
| `hr_site_theme` | String | 当前主题 'light' / 'dark' |
| `hr_site_visitor_count` | Number | 访客计数 |
| `hr_site_auth` | Object | 登录状态 `{ loggedIn: true, token: 'xxx' }` |

### 3.2 数据结构详情

#### profile - 个人基本信息
```json
{
  "name": "胡镕",
  "title": "物联网工程 · 大连民族大学",
  "slogan": "好好学习，专注自我，他强他横由他去",
  "bio": "大连民族大学物联网工程专业大一学生...",
  "avatar": "/assets/avatar.png",
  "email": "hurong522678@qq.com",
  "school": "大连民族大学",
  "major": "物联网工程",
  "class_name": "物联244",
  "gpa": "3.8/4.0",
  "certificates": ["英语四级"],
  "social_links": [
    { "name": "邮箱", "url": "mailto:hurong522678@qq.com", "icon": "fa-envelope" }
  ]
}
```

#### education - 教育经历
```json
[
  {
    "id": "edu_1",
    "school": "常丰小学",
    "period": "2012 - 2018",
    "description": "小学阶段"
  }
]
```

#### projects - 项目列表
```json
[
  {
    "id": "proj_1",
    "title": "非遗凤翔木板年画",
    "subtitle": "国创赛项目",
    "description": "与文法学院学生合作...",
    "tags": ["非遗", "文创", "团队合作"],
    "award": "国创赛（未过校赛）",
    "cover": "/assets/images/project1.jpg",
    "year": "2025"
  }
]
```

#### activities - 校内活动
```json
[
  {
    "id": "act_1",
    "title": "一帮一互助学习小组",
    "type": "校内活动",
    "description": "...",
    "award": "院级一等奖",
    "images": ["/assets/images/act1.jpg"]
  }
]
```

---

## 四、模拟API设计（api.js）

所有API均封装为 Promise，模拟真实后端调用：

```javascript
// 通用读取
api.getProfile()           // -> Promise<Profile>
api.getEducation()         // -> Promise<Education[]>
api.getProjects()          // -> Promise<Project[]>
api.getActivities()        // -> Promise<Activity[]>
api.getBlog()              // -> Promise<Blog[]>

// 通用写入（后台管理用）
api.updateProfile(data)    // -> Promise<Profile>
api.addEducation(item)     // -> Promise<Education>
api.updateEducation(id, data) // -> Promise<Education>
api.deleteEducation(id)    // -> Promise<void>
// ... 其他 CRUD 类似

// 认证
api.login(username, password)  // -> Promise<{token}>
api.logout()                  // -> Promise<void>
api.isLoggedIn()              // -> Boolean
```

**实现逻辑**：
1. 每次API调用前检查 localStorage 是否有数据
2. 无数据则从 `data/default.json` 加载默认数据
3. 写入操作通过 `localStorage.setItem` 持久化
4. 模拟 200ms 延迟（`setTimeout`）让交互更自然

---

## 五、主题系统设计

### 5.1 CSS 变量方案

```css
:root {
  /* 浅色主题变量 */
  --color-primary: #FF8A9E;
  --color-secondary: #7FD1C7;
  --color-accent: #FFB088;
  --color-text: #2D3A4B;
  --color-bg: #FAF7F2;
  --color-card: #FFFDF8;
  --shadow-soft: 0 4px 20px rgba(45, 58, 75, 0.08);
  --radius-lg: 16px;
  --radius-md: 12px;
}

[data-theme="dark"] {
  /* 暗色主题覆盖 */
  --color-primary: #FF6B8A;
  --color-secondary: #5BB8AF;
  --color-accent: #FFB088;
  --color-text: #E8E6E1;
  --color-bg: #0F1923;
  --color-card: #1A2533;
  --shadow-soft: 0 4px 20px rgba(0, 0, 0, 0.3);
}
```

### 5.2 切换逻辑

```javascript
// 切换流程
function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme') || 'light';
  const next = current === 'light' ? 'dark' : 'light';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('hr_site_theme', next);
}

// 初始化时读取
function initTheme() {
  const saved = localStorage.getItem('hr_site_theme') || 'light';
  document.documentElement.setAttribute('data-theme', saved);
}
```

---

## 六、关键功能实现方案

### 6.1 滚动进入动画（animations.js）

使用 `IntersectionObserver`：
```javascript
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('animate-in');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });
```

CSS动画类：
- `.fade-up`: 从下方淡入
- `.fade-left`: 从左侧滑入
- `.scale-in`: 缩放进入
- 延迟通过 `animation-delay: calc(var(--order) * 100ms)` 实现瀑布式效果

### 6.2 3D卡片效果

```css
.card-3d {
  transform-style: preserve-3d;
  perspective: 1000px;
  transition: transform 0.3s ease;
}
.card-3d:hover {
  transform: rotateY(5deg) rotateX(-5deg) scale(1.02);
}
```

Hero头像浮动：
```css
@keyframes float {
  0%, 100% { transform: translateY(0px) rotate(-2deg); }
  50% { transform: translateY(-20px) rotate(2deg); }
}
```

### 6.3 粒子背景（Canvas）

轻量级粒子系统：
- 50~80个小圆点
- 鼠标靠近时有轻微排斥/吸引效果
- 连接邻近粒子形成网格线（距离阈值内）
- 颜色跟随主题（浅色模式半透明珊瑚粉，暗色模式半透明霓虹色）

### 6.4 图片轮播

- 手动点击左右切换
- 自动播放（4秒间隔）
- 指示器小圆点
- 淡入淡出过渡

### 6.5 后台管理界面

- 单页应用风格：左侧固定侧边栏 + 右侧内容区
- Tab切换不同管理模块
- 表单实时绑定 localStorage
- 保存后 toast 提示
- 退出登录清除 session token

---

## 七、开发顺序

### 第一阶段：骨架搭建
1. 创建目录结构
2. 写 default.json 默认数据
3. 实现 theme.js + 主题CSS变量
4. 实现 api.js 基础 CRUD

### 第二阶段：前台页面
5. 写 index.html 结构（所有section）
6. 写 components.css（按钮、卡片、导航）
7. 实现 main.js 数据加载与渲染
8. 逐个section填充数据

### 第三阶段：特色功能
9. 滚动动画（IntersectionObserver）
10. 3D卡片 + Hero粒子背景
11. 主题切换
12. 图片轮播
13. 音乐播放器 + 访客统计
14. 简历下载按钮 + 回到顶部

### 第四阶段：后台管理
15. admin.html 页面结构
16. 登录功能
17. 各管理模块表单
18. 实时预览效果

### 第五阶段：部署
19. 本地测试
20. Cloudflare Pages / Vercel 部署
21. 最终验收

---

## 八、注意事项

1. **响应式断点**：
   - 移动端：< 768px（单列布局）
   - 平板：768px ~ 1024px（双列）
   - 桌面：> 1024px（三列/多列）

2. **性能**：
   - Canvas粒子数控制在80以内
   - 图片使用 WebP 格式（预留）
   - 字体 lazy load

3. **浏览器兼容**：
   - Chrome 90+、Edge 90+、Safari 14+、Firefox 88+
   - 使用 CSS 变量需注意 fallback

4. **安全（后台）**：
   - localStorage 存储的 token 仅为演示用，非真实安全方案
   - 退出登录后清除所有 session 相关数据
