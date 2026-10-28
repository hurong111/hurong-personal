/**
 * 前台主入口
 * 初始化所有模块并渲染数据
 */

document.addEventListener('DOMContentLoaded', async () => {
  try {
    // 初始化主题（必须第一个）
    ThemeManager.init();

    // 初始化动画
    Animations.initNavbar();
    Animations.initMobileMenu();
    Animations.initBackToTop();
    Animations.initScrollSpy();

    // 初始化 API 数据
    await api.init();

    // 渲染各区块
    await renderAll();

    // 初始化滚动动画（渲染完数据后）
    Animations.initScrollAnimations();

    // 初始化粒子背景
    Animations.initParticles('hero-particles');

    // 初始化访客统计
    VisitorCounter.init();

    // 初始化音乐播放器
    MusicPlayer.init();

    // 初始化轮播
    Carousel.init('activities-carousel');

    // 初始化博客弹层
    initBlogModal();

    console.log('✨ Site initialized successfully!');
  } catch (err) {
    console.error('Site init failed:', err);
  }
});

// ===== 渲染函数 =====

async function renderAll() {
  await Promise.all([
    renderHero(),
    renderAbout(),
    renderEducation(),
    renderProjects(),
    renderActivities(),
    renderHobbies(),
    renderBlog(),
    renderContact(),
    renderFooter()
  ]);
}

async function renderHero() {
  const profile = await api.getProfile();
  const el = document.getElementById('hero-content');
  if (!el) return;

  const socials = (profile.social_links || []).map(s =>
    `<a href="${s.url}" class="hero-social" title="${s.name}" aria-label="${s.name}"><i class="${s.icon}"></i></a>`
  ).join('');

  el.innerHTML = `
    <p class="hero-greeting fade-up">Hello World，我是</p>
    <div class="hero-avatar fade-up">
      <img src="${profile.avatar}" alt="头像" onerror="this.style.display='none'">
    </div>
    <h1 class="hero-name fade-up">${profile.name}</h1>
    <p class="hero-title fade-up">${profile.title}</p>
    <p class="hero-slogan fade-up">「 ${profile.slogan} 」</p>
    <div class="hero-actions fade-up">
      <a href="#projects" class="btn btn-primary">
        <i class="fa-solid fa-rocket"></i> 看看我的项目
      </a>
      <a href="#blog" class="btn btn-secondary">
        <i class="fa-solid fa-pen-nib"></i> 读读我的博客
      </a>
    </div>
    ${socials ? `<div class="hero-socials fade-up">${socials}</div>` : ''}
  `;

  // 简历下载
  const resumeBtn = document.getElementById('download-resume');
  if (resumeBtn) {
    resumeBtn.addEventListener('click', (e) => {
      e.preventDefault();
      alert('简历下载功能：请在 /assets/resume.pdf 放置你的简历文件后即可下载');
    });
  }
}

async function renderAbout() {
  const profile = await api.getProfile();
  const el = document.getElementById('about-content');
  if (!el) return;

  const certs = (profile.certificates || []).map(c =>
    `<span class="tag">${c}</span>`
  ).join('');

  // 技能标签
  const skills = ['Unity3D', '前端开发', '物联网嵌入式'].map(s =>
    `<span class="tag tag-skill">${s}</span>`
  ).join('');

  // 简介按句号拆成两段（保持原文不变）
  const bio = profile.bio || '';
  const splitAt = bio.indexOf('。', Math.ceil(bio.length / 3));
  const bioPart1 = splitAt > 0 ? bio.slice(0, splitAt + 1) : bio;
  const bioPart2 = splitAt > 0 ? bio.slice(splitAt + 1) : '';

  el.innerHTML = `
    <div class="about-photo-wrap fade-left">
      <div class="about-photo">
        <img src="assets/images/22.jpg" alt="${profile.name}的照片" loading="lazy"
             onerror="this.parentElement.classList.add('photo-missing'); this.style.display='none'">
        <span class="placeholder-text" aria-hidden="true">${profile.name[0]}</span>
      </div>
      <!-- 卡片周围的俏皮小装饰（轻微浮动，增加灵动感） -->
      <span class="about-deco deco-star" aria-hidden="true"><i class="fa-solid fa-star"></i></span>
      <span class="about-deco deco-heart" aria-hidden="true"><i class="fa-solid fa-heart"></i></span>
      <span class="about-deco deco-dot" aria-hidden="true"></span>
      <span class="about-deco deco-ring" aria-hidden="true"></span>
    </div>
    <div class="about-info">
      <!-- 各元素按 --ad 依次错开淡入 -->
      <h3 class="fade-up" style="--ad: 100ms">你好，我是 ${profile.name} <i class="fa-solid fa-hand-sparkles" style="color:var(--color-accent)"></i></h3>
      <p class="about-lead fade-up" style="--ad: 220ms">${bioPart1}</p>
      ${bioPart2 ? `<p class="about-sub fade-up" style="--ad: 320ms">${bioPart2}</p>` : ''}
      <div class="about-grid fade-up" style="--ad: 440ms">
        <div class="about-item">
          <i class="fa-solid fa-school"></i>
          <span>${profile.school}</span>
        </div>
        <div class="about-item">
          <i class="fa-solid fa-code"></i>
          <span>${profile.major}</span>
        </div>
        <div class="about-item">
          <i class="fa-solid fa-users"></i>
          <span>${profile.class_name}</span>
        </div>
        <div class="about-item">
          <i class="fa-solid fa-envelope"></i>
          <a href="mailto:${profile.email}" class="about-email">${profile.email}</a>
        </div>
      </div>
      <div class="about-certs fade-up" style="--ad: 560ms">
        ${certs}
        ${skills}
      </div>
    </div>
  `;
}

async function renderEducation() {
  const list = await api.getEducation();
  const el = document.getElementById('timeline');
  if (!el) return;

  el.innerHTML = list.map((item, i) => {
    // 最后一个阶段（最新经历）使用发光渐变节点
    const isCurrent = i === list.length - 1;
    return `
    <div class="timeline-item ${isCurrent ? 'timeline-current' : ''} fade-up" style="--order: ${i}">
      <div class="timeline-dot"></div>
      <div class="timeline-card">
        <div class="timeline-period">${item.period}</div>
        <div class="timeline-school">${item.school}</div>
        <div class="timeline-desc">${item.description || ''}</div>
      </div>
    </div>
  `;
  }).join('');
}

async function renderProjects() {
  const list = await api.getProjects();
  const el = document.getElementById('projects-grid');
  if (!el) return;

  const icons = ['fa-solid fa-stamp', 'fa-brands fa-unity', 'fa-solid fa-fire'];
  // 三个项目视觉区实拍/作品图（按现有项目顺序对应：木版年画 / 民族服饰展馆 / 火灾逃生系统）
  const covers = ['assets/images/55.jpg', 'assets/images/33.jpg', 'assets/images/44.jpg'];

  el.innerHTML = list.map((p, i) => {
    // 技术标签：浅色描边胶囊
    const tags = (p.tags || []).map(t => `<span class="tag-outline">${t}</span>`).join('');
    const cover = covers[i];
    return `
      <article class="project-card fade-up" style="--order: ${i}">
        <div class="project-cover cover-${i % 3} ${cover ? 'has-photo' : ''}">
          <i class="${icons[i % icons.length]}"></i>
          ${cover ? `<img class="project-cover-img" src="${cover}" alt="${p.title} 项目展示图" loading="lazy" decoding="async" onerror="this.remove(); this.parentElement.classList.remove('has-photo')">` : ''}
        </div>
        <div class="project-body">
          <div class="project-meta">
            <span class="project-num-badge">${String(i + 1).padStart(2, '0')}</span>
            <span class="year-tag">${p.year || ''}</span>
            ${p.subtitle ? `<span class="status-tag">${p.subtitle}</span>` : ''}
          </div>
          <h3 class="project-title">${p.title}</h3>
          <p class="project-desc">${p.description || ''}</p>
          <div class="project-tags">${tags}</div>
          ${p.award ? `<div class="project-award"><span class="award-badge"><i class="fa-solid fa-trophy"></i> ${p.award}</span></div>` : ''}
        </div>
      </article>
    `;
  }).join('');
}

async function renderActivities() {
  const list = await api.getActivities();
  const el = document.getElementById('activities-grid');
  if (!el) return;

  const icons = ['fa-solid fa-handshake-angle', 'fa-solid fa-people-group', 'fa-solid fa-graduation-cap'];

  el.innerHTML = list.map((a, i) => {
    // 有获奖的卡片作为主卡片（粉渐变柔光边框），其余保持简约白底
    const featured = Boolean(a.award);
    return `
    <div class="activity-card ${featured ? 'featured' : ''} scale-in" style="--order: ${i}">
      <div class="activity-icon">
        <i class="${icons[i % icons.length]}"></i>
      </div>
      <div class="activity-type">${a.type || ''}</div>
      ${a.year ? `<span class="activity-time">${a.year}</span>` : ''}
      <h4 class="activity-title">${a.title}</h4>
      <p class="activity-desc">${a.description || ''}</p>
      ${a.award ? `<div class="activity-award"><i class="fa-solid fa-star"></i> ${a.award}</div>` : ''}
    </div>
  `;
  }).join('');
}

// ===== 兴趣爱好 =====
async function renderHobbies() {
  const list = await api.getHobbies();
  const el = document.getElementById('hobbies-grid');
  if (!el) return;

  if (!list.length) {
    el.innerHTML = '<p class="empty-tip">还没有添加爱好，去后台添加吧～</p>';
    return;
  }

  // 大屏错落网格的三档卡片尺寸（按顺序循环：宽 / 标准 / 瘦长）
  const sizes = ['wide', 'std', 'slim', 'slim', 'wide', 'std'];

  el.innerHTML = list.map((h, i) => {
    const size = sizes[i % sizes.length];
    // 前三条为创作类：浅米底色 + 顶部粉青渐变细边
    const isCreate = i < 3;
    // 依据图标语义匹配专属 SVG 暗纹（顺序很重要：先精确匹配 book/open 等词根，避免被 pen 误伤）
    const texture = /gamepad/.test(h.icon) ? 'grid'
      : /book/.test(h.icon) ? 'lines'
      : /camera/.test(h.icon) ? 'bokeh'
      : /music|headphone/.test(h.icon) ? 'wave'
      : /utensils/.test(h.icon) ? 'cutlery'
      : /palette|pen|brush/.test(h.icon) ? 'diagonal'
      : 'grid';
    // --ad 控制入场错峰（120ms 递增）；--arc-angle 让每张卡右上角圆弧渐变方向略有区分
    return `
    <article class="hobby-card hobby-card--${size} ${isCreate ? 'hobby-card--create' : ''} fade-up"
             data-texture="${texture}"
             style="--ad: ${i * 120}ms; --arc-angle: ${120 + i * 40}deg;"
             aria-label="爱好：${h.title}">
      <span class="hobby-arc" aria-hidden="true"></span>
      <span class="hobby-texture" aria-hidden="true"></span>
      <div class="hobby-icon" aria-hidden="true"><i class="${h.icon || 'fa-solid fa-heart'}"></i></div>
      <h3 class="hobby-title">${h.title}</h3>
      <p class="hobby-desc">${h.description || ''}</p>
    </article>
  `;
  }).join('');
}

// ===== 博客 =====
async function renderBlog() {
  const list = await api.getBlog();
  const el = document.getElementById('blog-grid');
  if (!el) return;

  if (!list.length) {
    el.innerHTML = '<p class="empty-tip">第一篇文章正在酝酿中，敬请期待 ✍️</p>';
    return;
  }

  // 第一篇作为头条大卡（左侧日期视觉板 + 右侧正文），其余为常规卡片
  el.innerHTML = list.map((b, i) => {
    const tags = (b.tags || []).map(t => `<span class="blog-tag">${t}</span>`).join('');
    const excerpt = b.excerpt || (b.content || '').slice(0, 60);
    const readTime = b.read_time || Math.max(1, Math.round((b.content || '').length / 400)) + ' 分钟';
    // 从日期拆出「日」与「月份」，用于头条卡的视觉板（解析失败时回退为空）
    const d = new Date(b.date || '');
    const day = isNaN(d) ? '' : String(d.getDate()).padStart(2, '0');
    const mon = isNaN(d) ? '' : d.toLocaleString('en-US', { month: 'short' });
    const featured = i === 0;
    return `
      <article class="blog-card ${featured ? 'blog-card-featured' : ''} fade-up" style="--order: ${i}" data-blog-id="${b.id}" tabindex="0" role="button" aria-label="阅读文章：${b.title}">
        ${featured ? `
        <div class="blog-visual" aria-hidden="true">
          <span class="blog-visual-day">${day}</span>
          <span class="blog-visual-mon">${mon}</span>
          <span class="blog-visual-line"></span>
        </div>
        ` : ''}
        <div class="blog-body">
          <div class="blog-card-top">
            <time class="blog-date" datetime="${b.date}">${b.date || ''}</time>
            <span class="blog-readtime"><i class="fa-regular fa-clock"></i> ${readTime}</span>
          </div>
          <h3 class="blog-title">${b.title}</h3>
          <p class="blog-excerpt">${excerpt}${excerpt.length >= 60 ? '…' : ''}</p>
          <div class="blog-card-bottom">
            <div class="blog-tags">${tags}</div>
            <span class="blog-more">阅读全文 <i class="fa-solid fa-arrow-right"></i></span>
          </div>
        </div>
      </article>
    `;
  }).join('');

  // 点击打开弹层（事件委托）
  el.querySelectorAll('.blog-card').forEach(card => {
    card.addEventListener('click', () => openBlogModal(card.dataset.blogId));
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openBlogModal(card.dataset.blogId);
      }
    });
  });
}

// 博客弹层
async function openBlogModal(id) {
  const list = await api.getBlog();
  const post = list.find(x => x.id === id);
  if (!post) return;

  const body = document.getElementById('blog-modal-body');
  const tags = (post.tags || []).map(t => `<span class="blog-tag">${t}</span>`).join('');
  const paragraphs = (post.content || '').split(/\n\n+/).filter(Boolean)
    .map(p => `<p>${p}</p>`).join('');

  body.innerHTML = `
    <header class="blog-modal-head">
      <div class="blog-modal-meta">
        <time datetime="${post.date}">${post.date || ''}</time>
        <span class="dot-sep">·</span>
        <span>${post.read_time || ''}</span>
      </div>
      <h2>${post.title}</h2>
      <div class="blog-modal-tags">${tags}</div>
    </header>
    <div class="blog-modal-content">${paragraphs}</div>
  `;

  document.getElementById('blog-modal-overlay').classList.add('show');
  document.body.style.overflow = 'hidden';
  document.getElementById('blog-modal-close').focus();
}

function closeBlogModal() {
  document.getElementById('blog-modal-overlay').classList.remove('show');
  document.body.style.overflow = '';
}

function initBlogModal() {
  const overlay = document.getElementById('blog-modal-overlay');
  if (!overlay) return;
  document.getElementById('blog-modal-close').addEventListener('click', closeBlogModal);
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeBlogModal();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlay.classList.contains('show')) closeBlogModal();
  });
}

async function renderContact() {
  const profile = await api.getProfile();
  const el = document.getElementById('contact-grid');
  if (!el) return;

  el.innerHTML = `
    <a class="contact-card contact-card--mail fade-up" href="mailto:${profile.email}" style="text-decoration:none" aria-label="发邮件到 ${profile.email}">
      <i class="fa-solid fa-envelope" aria-hidden="true"></i>
      <h4>邮箱</h4>
      <p>${profile.email}</p>
    </a>
    <div class="contact-card fade-up">
      <i class="fa-solid fa-school" aria-hidden="true"></i>
      <h4>学校</h4>
      <p>${profile.school}</p>
    </div>
    <div class="contact-card fade-up">
      <i class="fa-solid fa-code" aria-hidden="true"></i>
      <h4>专业</h4>
      <p>${profile.major}</p>
    </div>
    <div class="contact-card fade-up">
      <i class="fa-solid fa-users" aria-hidden="true"></i>
      <h4>班级</h4>
      <p>${profile.class_name}</p>
    </div>
  `;

  // 社交链接圆标
  const socialEl = document.getElementById('social-links');
  if (socialEl) {
    const socials = (profile.social_links || []).map(s =>
      `<a href="${s.url}" class="social-btn" title="${s.name}" aria-label="${s.name}"><i class="${s.icon}"></i></a>`
    ).join('');
    socialEl.innerHTML = socials;
  }
}

async function renderFooter() {
  const el = document.getElementById('footer-content');
  if (!el) return;

  const year = new Date().getFullYear();
  el.innerHTML = `
    <p class="footer-visitors">
      <i class="fa-solid fa-eye"></i> 第 <span id="visitor-count">00000</span> 位访客
    </p>
    <nav class="footer-nav" aria-label="页脚导航">
      <a href="#about">关于我</a><a href="#projects">项目</a><a href="#hobbies">爱好</a><a href="#blog">博客</a><a href="#contact">联系</a>
    </nav>
    <p class="footer-copyright">
      © ${year} 胡镕 · 用 <i class="fa-solid fa-heart" style="color:var(--color-primary)"></i> 和 AI 打造
    </p>
  `;
}
