/**
 * 后台管理逻辑
 */

const AdminApp = {
  currentTab: 'profile',
  editModal: null,
  editingId: null,

  async init() {
    // 检查登录状态
    if (!api.isLoggedIn()) {
      this.showLogin();
    } else {
      this.showDashboard();
    }
  },

  // ===== 登录页 =====
  showLogin() {
    document.body.innerHTML = `
      <link rel="stylesheet" href="css/theme.css">
      <link rel="stylesheet" href="css/style.css">
      <link rel="stylesheet" href="css/admin.css">
      <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700&family=Noto+Sans+SC:wght@400;500;600;700&display=swap" rel="stylesheet">
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
      <div class="admin-login">
        <div class="login-card">
          <div class="login-logo">H</div>
          <h1 class="login-title">管理后台</h1>
          <p class="login-subtitle">胡镕的个人网站</p>
          <form id="login-form">
            <div class="form-group">
              <label class="form-label">账号</label>
              <input type="text" class="form-input" id="login-username" value="admin" required>
            </div>
            <div class="form-group">
              <label class="form-label">密码</label>
              <input type="password" class="form-input" id="login-password" value="hurong522678" required>
            </div>
            <div class="login-error" id="login-error">账号或密码错误，请重试</div>
            <button type="submit" class="login-btn">登录</button>
          </form>
          <div class="login-hint">
            <i class="fa-solid fa-info-circle"></i> 演示账号：admin / hurong522678
          </div>
        </div>
      </div>
    `;

    // 绑定登录表单事件（此时 api 已在上方 admin.html 中加载）
    const form = document.getElementById('login-form');
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const username = document.getElementById('login-username').value;
      const password = document.getElementById('login-password').value;
      const errorEl = document.getElementById('login-error');
      try {
        await api.login(username, password);
        window.location.reload();
      } catch (err) {
        errorEl.classList.add('show');
      }
    });
  },

  // ===== 主面板 =====
  async showDashboard() {
    await api.init();

    document.body.innerHTML = `
      <link rel="stylesheet" href="css/theme.css">
      <link rel="stylesheet" href="css/style.css">
      <link rel="stylesheet" href="css/admin.css">
      <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700&family=Noto+Sans+SC:wght@400;500;600;700&display=swap" rel="stylesheet">
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
      <div class="admin-layout">
        <!-- 侧边栏 -->
        <aside class="admin-sidebar">
          <div class="admin-brand">
            <h2>🎨 管理后台</h2>
            <p>胡镕的个人网站</p>
          </div>
          <ul class="admin-nav" id="admin-nav">
            <li class="admin-nav-item active" data-tab="profile">
              <i class="fa-solid fa-user"></i> 基本信息
            </li>
            <li class="admin-nav-item" data-tab="projects">
              <i class="fa-solid fa-folder"></i> 项目管理
            </li>
            <li class="admin-nav-item" data-tab="activities">
              <i class="fa-solid fa-people-group"></i> 活动管理
            </li>
            <li class="admin-nav-item" data-tab="hobbies">
              <i class="fa-solid fa-heart"></i> 爱好管理
            </li>
            <li class="admin-nav-item" data-tab="education">
              <i class="fa-solid fa-graduation-cap"></i> 教育经历
            </li>
            <li class="admin-nav-item" data-tab="blog">
              <i class="fa-solid fa-newspaper"></i> 博客管理
            </li>
            <li class="admin-nav-item" data-tab="stats">
              <i class="fa-solid fa-chart-pie"></i> 数据统计
            </li>
          </ul>
          <div class="admin-logout">
            <a href="index.html" class="admin-logout-btn" style="text-decoration:none;display:block;text-align:center;margin-bottom:8px;">
              <i class="fa-solid fa-house"></i> 返回前台
            </a>
            <button class="admin-logout-btn" id="logout-btn">
              <i class="fa-solid fa-right-from-bracket"></i> 退出登录
            </button>
          </div>
        </aside>

        <!-- 主内容 -->
        <main class="admin-main">
          <div class="admin-header">
            <h1 id="page-title">基本信息</h1>
            <p id="page-subtitle">编辑你的个人资料</p>
          </div>
          <div class="admin-content" id="admin-content"></div>
        </main>
      </div>

      <!-- Toast -->
      <div class="toast" id="toast"></div>

      <!-- Modal -->
      <div class="modal-overlay" id="modal-overlay">
        <div class="modal" id="modal"></div>
      </div>

      <script src="js/api.js"><\/script>
      <script src="js/theme.js"><\/script>
      <script src="js/admin.js"><\/script>
    `;

    // 绑定事件
    this.bindNavEvents();
    document.getElementById('logout-btn').addEventListener('click', () => {
      api.logout();
      window.location.href = 'admin.html';
    });

    // 初始化主题
    ThemeManager.init();

    // 显示默认 Tab
    await this.switchTab('profile');
  },

  bindNavEvents() {
    document.querySelectorAll('.admin-nav-item').forEach(item => {
      item.addEventListener('click', () => {
        const tab = item.dataset.tab;
        document.querySelectorAll('.admin-nav-item').forEach(i => i.classList.remove('active'));
        item.classList.add('active');
        this.switchTab(tab);
      });
    });
  },

  async switchTab(tab) {
    this.currentTab = tab;
    const titles = {
      profile: ['基本信息', '编辑你的个人资料'],
      projects: ['项目管理', '管理你的项目和获奖记录'],
      activities: ['活动管理', '管理校内活动和社会实践'],
      hobbies: ['爱好管理', '管理你的兴趣与爱好'],
      education: ['教育经历', '管理你的教育背景'],
      blog: ['博客管理', '发布和管理博客文章'],
      stats: ['数据统计', '查看网站访问数据']
    };
    document.getElementById('page-title').textContent = titles[tab][0];
    document.getElementById('page-subtitle').textContent = titles[tab][1];

    const content = document.getElementById('admin-content');
    switch (tab) {
      case 'profile': content.innerHTML = await this.renderProfileForm(); this.bindProfileEvents(); break;
      case 'projects': content.innerHTML = await this.renderList('projects'); this.bindListEvents('projects'); break;
      case 'activities': content.innerHTML = await this.renderList('activities'); this.bindListEvents('activities'); break;
      case 'hobbies': content.innerHTML = await this.renderList('hobbies'); this.bindListEvents('hobbies'); break;
      case 'education': content.innerHTML = await this.renderList('education'); this.bindListEvents('education'); break;
      case 'blog': content.innerHTML = await this.renderList('blog'); this.bindListEvents('blog'); break;
      case 'stats': content.innerHTML = await this.renderStats(); break;
    }
  },

  // ===== Profile 表单 =====
  async renderProfileForm() {
    const p = await api.getProfile();
    const socialsText = (p.social_links || []).map(s => `${s.name}|${s.url}|${s.icon}`).join('\n');
    return `
      <form class="admin-form" id="profile-form">
        <div class="form-group">
          <label class="form-label">姓名</label>
          <input type="text" class="form-input" name="name" value="${p.name || ''}">
        </div>
        <div class="form-group">
          <label class="form-label">身份标签</label>
          <input type="text" class="form-input" name="title" value="${p.title || ''}">
        </div>
        <div class="form-group">
          <label class="form-label">Slogan</label>
          <input type="text" class="form-input" name="slogan" value="${p.slogan || ''}">
        </div>
        <div class="form-group">
          <label class="form-label">个人简介</label>
          <textarea class="form-textarea" name="bio" rows="5">${p.bio || ''}</textarea>
        </div>
        <div class="form-group">
          <label class="form-label">头像图片链接（可填本地路径如 assets/avatar.png，或网络图片 URL）</label>
          <input type="text" class="form-input" name="avatar" value="${p.avatar && p.avatar.startsWith('data:') ? '' : (p.avatar || '')}" placeholder="assets/avatar.png 或 https://...">
        </div>
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">学校</label>
            <input type="text" class="form-input" name="school" value="${p.school || ''}">
          </div>
          <div class="form-group">
            <label class="form-label">专业</label>
            <input type="text" class="form-input" name="major" value="${p.major || ''}">
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">班级</label>
            <input type="text" class="form-input" name="class_name" value="${p.class_name || ''}">
          </div>
          <div class="form-group">
            <label class="form-label">邮箱</label>
            <input type="email" class="form-input" name="email" value="${p.email || ''}">
          </div>
        </div>
        <div class="form-group">
          <label class="form-label">证书（用逗号分隔）</label>
          <input type="text" class="form-input" name="certificates" value="${(p.certificates || []).join(', ')}">
        </div>
        <div class="form-group">
          <label class="form-label">社交链接（每行一条，格式：名称|链接|图标class，图标可留空）</label>
          <textarea class="form-textarea" name="social_links_text" rows="3" placeholder="GitHub|https://github.com/xxx|fa-brands fa-github">${socialsText}</textarea>
        </div>
        <div class="form-actions">
          <button type="submit" class="btn-admin btn-admin-primary">
            <i class="fa-solid fa-save"></i> 保存修改
          </button>
          <button type="button" class="btn-admin btn-admin-secondary" onclick="location.reload()">
            <i class="fa-solid fa-rotate"></i> 重置
          </button>
        </div>
      </form>
    `;
  },

  // Profile 表单提交绑定
  bindProfileEvents() {
    const form = document.getElementById('profile-form');
    if (!form) return;
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const data = Object.fromEntries(new FormData(form));
      if (data.certificates) {
        data.certificates = data.certificates.split(',').map(s => s.trim()).filter(Boolean);
      }
      // 社交链接解析：名称|链接|图标
      const socialsText = (data.social_links_text || '').trim();
      data.social_links = socialsText ? socialsText.split('\n').map(line => {
        const [name, url, icon] = line.split('|').map(s => (s || '').trim());
        return { name: name || '', url: url || '', icon: icon || 'fa-solid fa-link' };
      }).filter(s => s.name && s.url) : [];
      delete data.social_links_text;
      // 头像为空时保留默认 data URI
      if (!data.avatar) delete data.avatar;
      await api.updateProfile(data);
      this.showToast('保存成功 ✨ 刷新前台页面即可看到更新');
    });
  },

  // ===== 列表管理 =====
  async renderList(type) {
    let list = [];
    if (type === 'projects') list = await api.getProjects();
    else if (type === 'activities') list = await api.getActivities();
    else if (type === 'hobbies') list = await api.getHobbies();
    else if (type === 'education') list = await api.getEducation();
    else if (type === 'blog') list = await api.getBlog();

    let itemsHtml = list.map(item => {
      const title = item.title || item.school || item.name;
      const subtitle = item.subtitle || item.period || item.type || item.date || '';
      const desc = item.description || item.content || '';
      return `
        <div class="admin-list-item">
          <div class="admin-list-info">
            <h4>${title}</h4>
            <p>${subtitle}${desc ? ' · ' + (desc.length > 50 ? desc.slice(0, 50) + '...' : desc) : ''}</p>
          </div>
          <div class="admin-list-actions">
            <button class="btn-mini btn-mini-edit" data-id="${item.id}" title="编辑">
              <i class="fa-solid fa-pen"></i>
            </button>
            <button class="btn-mini btn-mini-delete" data-id="${item.id}" title="删除">
              <i class="fa-solid fa-trash"></i>
            </button>
          </div>
        </div>
      `;
    }).join('');

    return `
      <div class="admin-list">
        ${list.length === 0 ? '<p style="color:var(--color-text-muted);text-align:center;padding:40px;">暂无数据</p>' : itemsHtml}
        <button class="add-btn" id="add-${type}">
          <i class="fa-solid fa-plus"></i> 添加新${this.getTypeLabel(type)}
        </button>
      </div>
    `;
  },

  getTypeLabel(type) {
    const labels = { projects: '项目', activities: '活动', hobbies: '爱好', education: '教育经历', blog: '博客' };
    return labels[type] || '条目';
  },

  bindListEvents(type) {
    // 添加按钮
    document.getElementById('add-' + type).addEventListener('click', () => {
      this.showModal(type);
    });

    // 编辑按钮
    document.querySelectorAll('.btn-mini-edit').forEach(btn => {
      btn.addEventListener('click', () => {
        this.showModal(type, btn.dataset.id);
      });
    });

    // 删除按钮
    document.querySelectorAll('.btn-mini-delete').forEach(btn => {
      btn.addEventListener('click', async () => {
        if (!confirm('确定删除吗？')) return;
        const id = btn.dataset.id;
        await this.deleteItem(type, id);
        await this.switchTab(type);
        this.showToast('删除成功');
      });
    });
  },

  async deleteItem(type, id) {
    if (type === 'projects') await api.deleteProject(id);
    else if (type === 'activities') await api.deleteActivity(id);
    else if (type === 'hobbies') await api.deleteHobby(id);
    else if (type === 'education') await api.deleteEducation(id);
    else if (type === 'blog') await api.deleteBlog(id);
  },

  // ===== 模态框（增/编辑） =====
  async showModal(type, id = null) {
    this.editingId = id;
    let data = {};
    if (id) {
      const list = type === 'projects' ? await api.getProjects()
                : type === 'activities' ? await api.getActivities()
                : type === 'hobbies' ? await api.getHobbies()
                : type === 'education' ? await api.getEducation()
                : await api.getBlog();
      data = list.find(x => x.id === id) || {};
    }

    const fields = this.getModalFields(type, data);
    const title = id ? '编辑' : '添加' + this.getTypeLabel(type);

    const modal = document.getElementById('modal');
    modal.innerHTML = `
      <div class="modal-header">
        <h3>${title}</h3>
        <div class="modal-close" onclick="AdminApp.closeModal()"><i class="fa-solid fa-xmark"></i></div>
      </div>
      <form id="modal-form">
        ${fields}
        <div class="form-actions">
          <button type="submit" class="btn-admin btn-admin-primary">
            <i class="fa-solid fa-save"></i> 保存
          </button>
          <button type="button" class="btn-admin btn-admin-secondary" onclick="AdminApp.closeModal()">
            取消
          </button>
        </div>
      </form>
    `;
    document.getElementById('modal-overlay').classList.add('show');

    document.getElementById('modal-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      const formData = Object.fromEntries(new FormData(e.target));
      await this.saveItem(type, formData);
      this.closeModal();
      await this.switchTab(type);
      this.showToast('保存成功 ✨');
    });
  },

  getModalFields(type, d) {
    const input = (name, label, val, extra = '') => `
      <div class="form-group">
        <label class="form-label">${label}</label>
        <input type="text" class="form-input" name="${name}" value="${val || ''}" ${extra}>
      </div>
    `;
    const textarea = (name, label, val) => `
      <div class="form-group">
        <label class="form-label">${label}</label>
        <textarea class="form-textarea" name="${name}" rows="3">${val || ''}</textarea>
      </div>
    `;

    if (type === 'projects') {
      return input('title', '项目名称', d.title) +
             input('subtitle', '副标题', d.subtitle) +
             input('year', '年份', d.year) +
             input('award', '获奖情况', d.award) +
             input('tags', '标签（逗号分隔）', (d.tags || []).join(', ')) +
             textarea('description', '项目描述', d.description);
    }
    if (type === 'activities') {
      return input('title', '活动名称', d.title) +
             input('type', '活动类型', d.type) +
             input('award', '获奖情况（可选）', d.award) +
             textarea('description', '活动描述', d.description);
    }
    if (type === 'hobbies') {
      return input('icon', '图标 class（Font Awesome，如 fa-solid fa-gamepad）', d.icon) +
             input('title', '爱好名称', d.title) +
             textarea('description', '爱好描述', d.description);
    }
    if (type === 'education') {
      return input('school', '学校名称', d.school) +
             input('period', '时间区间', d.period) +
             textarea('description', '描述', d.description);
    }
    if (type === 'blog') {
      return input('title', '文章标题', d.title) +
             input('date', '发布日期（如 2026-10-27）', d.date) +
             input('read_time', '预计阅读时长（如 5 分钟）', d.read_time) +
             input('tags', '标签（逗号分隔）', (d.tags || []).join(', ')) +
             input('excerpt', '摘要（列表页显示）', d.excerpt) +
             textarea('content', '文章正文（空行分段）', d.content);
    }
    return '';
  },

  async saveItem(type, data) {
    // 处理标签
    if (data.tags) {
      data.tags = data.tags.split(',').map(s => s.trim()).filter(Boolean);
    }
    if (data.id) delete data.id;

    if (type === 'projects') {
      if (this.editingId) await api.updateProject(this.editingId, data);
      else await api.addProject(data);
    } else if (type === 'activities') {
      if (this.editingId) await api.updateActivity(this.editingId, data);
      else await api.addActivity(data);
    } else if (type === 'hobbies') {
      if (this.editingId) await api.updateHobby(this.editingId, data);
      else await api.addHobby(data);
    } else if (type === 'education') {
      if (this.editingId) await api.updateEducation(this.editingId, data);
      else await api.addEducation(data);
    } else if (type === 'blog') {
      if (this.editingId) await api.updateBlog(this.editingId, data);
      else await api.addBlog(data);
    }
  },

  closeModal() {
    document.getElementById('modal-overlay').classList.remove('show');
  },

  // ===== 统计 =====
  async renderStats() {
    const [projects, activities, hobbies, education, blog] = await Promise.all([
      api.getProjects(), api.getActivities(), api.getHobbies(), api.getEducation(), api.getBlog()
    ]);
    const visitorCount = api.getVisitorCount();

    return `
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon"><i class="fa-solid fa-folder-open"></i></div>
          <div class="stat-value">${projects.length}</div>
          <div class="stat-label">项目数量</div>
        </div>
        <div class="stat-card">
          <div class="stat-icon"><i class="fa-solid fa-people-group"></i></div>
          <div class="stat-value">${activities.length}</div>
          <div class="stat-label">活动记录</div>
        </div>
        <div class="stat-card">
          <div class="stat-icon"><i class="fa-solid fa-heart"></i></div>
          <div class="stat-value">${hobbies.length}</div>
          <div class="stat-label">兴趣爱好</div>
        </div>
        <div class="stat-card">
          <div class="stat-icon"><i class="fa-solid fa-graduation-cap"></i></div>
          <div class="stat-value">${education.length}</div>
          <div class="stat-label">教育阶段</div>
        </div>
        <div class="stat-card">
          <div class="stat-icon"><i class="fa-solid fa-newspaper"></i></div>
          <div class="stat-value">${blog.length}</div>
          <div class="stat-label">博客文章</div>
        </div>
        <div class="stat-card">
          <div class="stat-icon"><i class="fa-solid fa-eye"></i></div>
          <div class="stat-value">${visitorCount}</div>
          <div class="stat-label">本次会话访客数</div>
        </div>
      </div>
      <div style="margin-top:var(--spacing-xl);text-align:center;">
        <button class="btn-admin btn-admin-danger" id="reset-data">
          <i class="fa-solid fa-rotate-left"></i> 重置所有数据为默认值
        </button>
      </div>
    `;
  },

  showToast(msg) {
    const toast = document.getElementById('toast');
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 2500);
  }
};

// 启动
AdminApp.init();
