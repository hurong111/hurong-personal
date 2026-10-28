/**
 * 模拟 API 模块
 * 使用 localStorage 实现 CRUD 操作
 */

const STORAGE_KEYS = {
  PROFILE: 'hr_site_profile',
  EDUCATION: 'hr_site_education',
  PROJECTS: 'hr_site_projects',
  ACTIVITIES: 'hr_site_activities',
  HOBBIES: 'hr_site_hobbies',
  BLOG: 'hr_site_blog',
  THEME: 'hr_site_theme',
  COUNTER: 'hr_site_visitor_count',
  AUTH: 'hr_site_auth',
  INITIALIZED: 'hr_site_initialized',
  DATA_VERSION: 'hr_site_data_version'
};

// 数据版本：升级后通过 seedMissingData 为老用户补种新增数据（不覆盖用户已有编辑）
const DATA_VERSION = '3';

const delay = (ms = 200) => new Promise(resolve => setTimeout(resolve, ms));

// 内置兜底默认数据（fetch 失败时使用）
const FALLBACK_DATA = {
  profile: {
    name: '胡镕',
    title: '物联网工程 · 大连民族大学',
    slogan: '好好学习，专注自我，他强他横由他去',
    bio: '大连民族大学物联网工程专业大一学生。热爱编程与创意实现，擅长 Unity3D 开发与前端设计。喜欢在数字世界里搭建有意思的东西，也喜欢用代码记录成长轨迹。已通过英语四级，正在探索技术与艺术结合的更多可能。',
    avatar: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' stop-color='%23FF8A9E'/%3E%3Cstop offset='100%25' stop-color='%237FD1C7'/%3E%3C/linearGradient%3E%3C/defs%3E%3Ccircle cx='100' cy='100' r='100' fill='url(%23g)'/%3E%3Ctext x='100' y='115' text-anchor='middle' font-size='60' font-family='sans-serif' fill='white' font-weight='bold'%3E胡%3C/text%3E%3C/svg%3E",
    email: 'hurong522678@qq.com',
    school: '大连民族大学',
    major: '物联网工程',
    class_name: '物联244',
    certificates: ['英语四级'],
    social_links: [
      { name: '邮箱', url: 'mailto:hurong522678@qq.com', icon: 'fa-solid fa-envelope' },
      { name: 'QQ', url: 'hurong522678@qq.com', icon: 'fa-brands fa-qq' }
    ]
  },
  education: [
    { id: 'edu_1', school: '常丰小学', period: '2012 — 2018', description: '小学阶段' },
    { id: 'edu_2', school: '文阁中学', period: '2018 — 2021', description: '初中阶段' },
    { id: 'edu_3', school: '毕节市第一中学', period: '2021 — 2024', description: '高中阶段' },
    { id: 'edu_4', school: '大连民族大学', period: '2024 — 至今', description: '物联网工程专业' }
  ],
  projects: [
    { id: 'proj_1', title: '非遗凤翔木板年画', subtitle: '国创赛项目', description: '与文法学院学生跨专业合作', tags: ['非遗', '文创'], award: '国创赛（未过校赛）', year: '2025' },
    { id: 'proj_2', title: 'Unity3D 民族服饰展馆', subtitle: '辽宁省虚拟现实设计大赛', description: '沉浸式的民族服饰虚拟展馆', tags: ['Unity3D', 'VR'], award: '辽宁省二等奖', year: '2025' },
    { id: 'proj_3', title: 'Unity3D 火灾逃生模拟系统', subtitle: '全国3D大赛', description: '火灾场景模拟与逃生训练', tags: ['Unity3D', '安全'], award: '辽宁省三等奖', year: '2025' }
  ],
  activities: [
    { id: 'act_1', title: '一帮一互助学习小组', type: '校内活动', description: '参与学院一对一互助学习小组', award: '院级一等奖', year: '2025', images: [] },
    { id: 'act_2', title: '三下乡社会实践', type: '社会实践', description: '暑期三下乡活动', award: '', year: '2025', images: [] },
    { id: 'act_3', title: '学子母校行', type: '社会实践', description: '回到高中母校分享经验', award: '', year: '2025', images: [] }
  ],
  hobbies: [
    { id: 'hob_1', icon: 'fa-solid fa-gamepad', title: '游戏与交互体验', description: '研究关卡设计与交互细节' },
    { id: 'hob_2', icon: 'fa-solid fa-palette', title: '平面设计', description: '做海报和排版练习' },
    { id: 'hob_3', icon: 'fa-solid fa-camera-retro', title: '摄影', description: '记录生活存档点' },
    { id: 'hob_4', icon: 'fa-solid fa-music', title: '听歌', description: '写代码时的循环歌单' },
    { id: 'hob_5', icon: 'fa-solid fa-book-open', title: '阅读', description: '科幻与设计类杂书' },
    { id: 'hob_6', icon: 'fa-solid fa-utensils', title: '探店美食', description: '用美食给学习充电' }
  ],
  blog: [
    { id: 'blog_1', title: '从零开始做个人网站', excerpt: '记录开发全过程', tags: ['前端'], date: '2026-10-27', read_time: '5 分钟', content: '记录了用 AI 辅助开发个人作品集网站的全过程，包括 PRD 设计、技术选型、部署上线的每一步。' }
  ]
};

// 初始化：首次访问时从 default.json 写入 localStorage
async function ensureInitialized() {
  if (localStorage.getItem(STORAGE_KEYS.INITIALIZED)) {
    await seedMissingData();
    return;
  }

  let data = null;
  try {
    const response = await fetch('data/default.json');
    if (!response.ok) throw new Error('Failed to load default data');
    data = await response.json();
  } catch (err) {
    console.warn('Default data fetch failed, using built-in fallback:', err);
    data = FALLBACK_DATA;
  }

  localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(data.profile));
  localStorage.setItem(STORAGE_KEYS.EDUCATION, JSON.stringify(data.education));
  localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(data.projects));
  localStorage.setItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify(data.activities));
  localStorage.setItem(STORAGE_KEYS.HOBBIES, JSON.stringify(data.hobbies || FALLBACK_DATA.hobbies));
  localStorage.setItem(STORAGE_KEYS.BLOG, JSON.stringify(data.blog));
  localStorage.setItem(STORAGE_KEYS.INITIALIZED, 'true');
  localStorage.setItem(STORAGE_KEYS.DATA_VERSION, DATA_VERSION);
}

// 老数据升级：仅为缺失的 key 补种默认值，不覆盖用户已有内容
async function seedMissingData() {
  if (localStorage.getItem(STORAGE_KEYS.DATA_VERSION) === DATA_VERSION) return;

  let defaults = {};
  try {
    const response = await fetch('data/default.json');
    defaults = await response.json();
  } catch {
    defaults = FALLBACK_DATA;
  }

  if (!localStorage.getItem(STORAGE_KEYS.HOBBIES)) {
    localStorage.setItem(STORAGE_KEYS.HOBBIES, JSON.stringify(defaults.hobbies || FALLBACK_DATA.hobbies));
  }
  // 旧版博客数据升级为富文本结构（含 excerpt/tags/read_time）
  const blog = readStorage(STORAGE_KEYS.BLOG, []);
  const needsBlogUpgrade = blog.length === 1 && blog[0].id === 'blog_1' && !blog[0].excerpt;
  if (needsBlogUpgrade && defaults.blog) {
    localStorage.setItem(STORAGE_KEYS.BLOG, JSON.stringify(defaults.blog));
  }

  // 旧版活动数据补种年份字段（时间标签用），不覆盖用户其它编辑
  const acts = readStorage(STORAGE_KEYS.ACTIVITIES, []);
  if (acts.length && acts.some(a => !a.year)) {
    const yearMap = { act_1: '2025', act_2: '2025', act_3: '2025' };
    writeStorage(STORAGE_KEYS.ACTIVITIES,
      acts.map(a => ({ ...a, year: a.year || yearMap[a.id] || '' })));
  }

  localStorage.setItem(STORAGE_KEYS.DATA_VERSION, DATA_VERSION);
}

function readStorage(key, fallback) {
  const raw = localStorage.getItem(key);
  if (!raw) return fallback;
  try {
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

function writeStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

// ===== API 对象 =====
const api = {
  init: ensureInitialized,

  // Profile
  async getProfile() {
    await delay();
    await ensureInitialized();
    return readStorage(STORAGE_KEYS.PROFILE, {});
  },
  async updateProfile(data) {
    await delay();
    const current = readStorage(STORAGE_KEYS.PROFILE, {});
    const updated = { ...current, ...data };
    writeStorage(STORAGE_KEYS.PROFILE, updated);
    return updated;
  },

  // Education
  async getEducation() {
    await delay();
    await ensureInitialized();
    return readStorage(STORAGE_KEYS.EDUCATION, []);
  },
  async addEducation(item) {
    await delay();
    const list = readStorage(STORAGE_KEYS.EDUCATION, []);
    const newItem = { ...item, id: item.id || 'edu_' + Date.now() };
    list.push(newItem);
    writeStorage(STORAGE_KEYS.EDUCATION, list);
    return newItem;
  },
  async updateEducation(id, data) {
    await delay();
    const list = readStorage(STORAGE_KEYS.EDUCATION, []);
    const idx = list.findIndex(x => x.id === id);
    if (idx >= 0) {
      list[idx] = { ...list[idx], ...data };
      writeStorage(STORAGE_KEYS.EDUCATION, list);
      return list[idx];
    }
    throw new Error('Item not found');
  },
  async deleteEducation(id) {
    await delay();
    const list = readStorage(STORAGE_KEYS.EDUCATION, []);
    const filtered = list.filter(x => x.id !== id);
    writeStorage(STORAGE_KEYS.EDUCATION, filtered);
  },

  // Projects
  async getProjects() {
    await delay();
    await ensureInitialized();
    return readStorage(STORAGE_KEYS.PROJECTS, []);
  },
  async addProject(item) {
    await delay();
    const list = readStorage(STORAGE_KEYS.PROJECTS, []);
    const newItem = { ...item, id: item.id || 'proj_' + Date.now() };
    list.push(newItem);
    writeStorage(STORAGE_KEYS.PROJECTS, list);
    return newItem;
  },
  async updateProject(id, data) {
    await delay();
    const list = readStorage(STORAGE_KEYS.PROJECTS, []);
    const idx = list.findIndex(x => x.id === id);
    if (idx >= 0) {
      list[idx] = { ...list[idx], ...data };
      writeStorage(STORAGE_KEYS.PROJECTS, list);
      return list[idx];
    }
    throw new Error('Item not found');
  },
  async deleteProject(id) {
    await delay();
    const list = readStorage(STORAGE_KEYS.PROJECTS, []);
    const filtered = list.filter(x => x.id !== id);
    writeStorage(STORAGE_KEYS.PROJECTS, filtered);
  },

  // Activities
  async getActivities() {
    await delay();
    await ensureInitialized();
    return readStorage(STORAGE_KEYS.ACTIVITIES, []);
  },
  async addActivity(item) {
    await delay();
    const list = readStorage(STORAGE_KEYS.ACTIVITIES, []);
    const newItem = { ...item, id: item.id || 'act_' + Date.now() };
    list.push(newItem);
    writeStorage(STORAGE_KEYS.ACTIVITIES, list);
    return newItem;
  },
  async updateActivity(id, data) {
    await delay();
    const list = readStorage(STORAGE_KEYS.ACTIVITIES, []);
    const idx = list.findIndex(x => x.id === id);
    if (idx >= 0) {
      list[idx] = { ...list[idx], ...data };
      writeStorage(STORAGE_KEYS.ACTIVITIES, list);
      return list[idx];
    }
    throw new Error('Item not found');
  },
  async deleteActivity(id) {
    await delay();
    const list = readStorage(STORAGE_KEYS.ACTIVITIES, []);
    const filtered = list.filter(x => x.id !== id);
    writeStorage(STORAGE_KEYS.ACTIVITIES, filtered);
  },

  // Hobbies
  async getHobbies() {
    await delay();
    await ensureInitialized();
    return readStorage(STORAGE_KEYS.HOBBIES, []);
  },
  async addHobby(item) {
    await delay();
    const list = readStorage(STORAGE_KEYS.HOBBIES, []);
    const newItem = { ...item, id: item.id || 'hob_' + Date.now() };
    list.push(newItem);
    writeStorage(STORAGE_KEYS.HOBBIES, list);
    return newItem;
  },
  async updateHobby(id, data) {
    await delay();
    const list = readStorage(STORAGE_KEYS.HOBBIES, []);
    const idx = list.findIndex(x => x.id === id);
    if (idx >= 0) {
      list[idx] = { ...list[idx], ...data };
      writeStorage(STORAGE_KEYS.HOBBIES, list);
      return list[idx];
    }
    throw new Error('Item not found');
  },
  async deleteHobby(id) {
    await delay();
    const list = readStorage(STORAGE_KEYS.HOBBIES, []);
    const filtered = list.filter(x => x.id !== id);
    writeStorage(STORAGE_KEYS.HOBBIES, filtered);
  },

  // Blog
  async getBlog() {
    await delay();
    await ensureInitialized();
    return readStorage(STORAGE_KEYS.BLOG, []);
  },
  async addBlog(item) {
    await delay();
    const list = readStorage(STORAGE_KEYS.BLOG, []);
    const newItem = { ...item, id: item.id || 'blog_' + Date.now() };
    list.unshift(newItem);
    writeStorage(STORAGE_KEYS.BLOG, list);
    return newItem;
  },
  async updateBlog(id, data) {
    await delay();
    const list = readStorage(STORAGE_KEYS.BLOG, []);
    const idx = list.findIndex(x => x.id === id);
    if (idx >= 0) {
      list[idx] = { ...list[idx], ...data };
      writeStorage(STORAGE_KEYS.BLOG, list);
      return list[idx];
    }
    throw new Error('Item not found');
  },
  async deleteBlog(id) {
    await delay();
    const list = readStorage(STORAGE_KEYS.BLOG, []);
    const filtered = list.filter(x => x.id !== id);
    writeStorage(STORAGE_KEYS.BLOG, filtered);
  },

  // Auth
  login(username, password) {
    return new Promise((resolve, reject) => {
      delay().then(() => {
        if (username === 'admin' && password === 'hurong522678') {
          const token = 'token_' + Date.now();
          writeStorage(STORAGE_KEYS.AUTH, { loggedIn: true, token });
          resolve({ token });
        } else {
          reject(new Error('账号或密码错误'));
        }
      });
    });
  },
  logout() {
    writeStorage(STORAGE_KEYS.AUTH, { loggedIn: false });
  },
  isLoggedIn() {
    const auth = readStorage(STORAGE_KEYS.AUTH, { loggedIn: false });
    return auth.loggedIn === true;
  },

  // Visitor Counter
  getVisitorCount() {
    return parseInt(localStorage.getItem(STORAGE_KEYS.COUNTER) || '0');
  },
  incrementVisitorCount() {
    const count = this.getVisitorCount() + 1;
    localStorage.setItem(STORAGE_KEYS.COUNTER, count.toString());
    return count;
  },

  // Reset all data
  async resetAll() {
    Object.values(STORAGE_KEYS).forEach(k => {
      if (k !== STORAGE_KEYS.AUTH && k !== STORAGE_KEYS.COUNTER) {
        localStorage.removeItem(k);
      }
    });
    await ensureInitialized();
  }
};
