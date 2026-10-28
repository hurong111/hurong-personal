/**
 * 动画效果模块
 * - 滚动进入动画
 * - Hero 粒子背景
 */

const Animations = {
  // 滚动进入动画
  initScrollAnimations() {
    const selectors = ['.fade-up', '.fade-left', '.fade-right', '.scale-in'];
    const elements = document.querySelectorAll(selectors.join(','));

    if (!('IntersectionObserver' in window)) {
      elements.forEach(el => el.classList.add('animate-in'));
      return;
    }

    // 页面处于隐藏状态时（后台标签、无渲染环境）浏览器会节流观察器回调，
    // 直接展示全部内容，避免用户切回来时看到长时间空白
    if (document.hidden) {
      elements.forEach(el => el.classList.add('animate-in', 'entered'));
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry, idx) => {
        if (entry.isIntersecting) {
          const el = entry.target;
          // 带自定义错峰变量（--ad / --row）的元素跳过自动瀑布延迟，走自己的节奏
          const hasCustomDelay = el.style.getPropertyValue('--ad') || el.style.getPropertyValue('--row');
          if (!hasCustomDelay) {
            const parentChildren = el.parentElement ? el.parentElement.children : [el];
            let delay = 0;
            for (let i = 0; i < parentChildren.length; i++) {
              if (parentChildren[i] === el) { delay = i * 80; break; }
            }
            el.style.transitionDelay = delay + 'ms';
          }
          el.classList.add('animate-in');
          // 入场动画结束后清除延迟并打上 entered 标记，避免后续 hover 响应变慢
          el.addEventListener('transitionend', () => {
            el.style.transitionDelay = '0ms';
            el.classList.add('entered');
          }, { once: true });
          observer.unobserve(el);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });

    elements.forEach(el => observer.observe(el));
  },

  // Hero 粒子背景
  initParticles(canvasId) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let particles = [];
    let mouse = { x: null, y: null };
    let width, height;

    function resize() {
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    }

    function init() {
      resize();
      particles = [];
      const count = Math.min(80, Math.floor((width * height) / 15000));
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          r: Math.random() * 2 + 1
        });
      }
    }

    function getColors() {
      const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
      return {
        dot: isDark ? 'rgba(255, 107, 138, 0.6)' : 'rgba(255, 138, 158, 0.5)',
        line: isDark ? 'rgba(91, 184, 175, 0.2)' : 'rgba(127, 209, 199, 0.3)'
      };
    }

    function draw() {
      ctx.clearRect(0, 0, width, height);
      const colors = getColors();

      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        // 鼠标交互
        if (mouse.x !== null) {
          const dx = mouse.x - p.x;
          const dy = mouse.y - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            p.x -= dx * 0.01;
            p.y -= dy * 0.01;
          }
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = colors.dot;
        ctx.fill();
      });

      // 连线
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = colors.line;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }

      requestAnimationFrame(draw);
    }

    // 鼠标事件
    canvas.addEventListener('mousemove', (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    });
    canvas.addEventListener('mouseleave', () => {
      mouse.x = null;
      mouse.y = null;
    });

    window.addEventListener('resize', () => {
      resize();
    });

    // 监听主题变化
    const observer = new MutationObserver(init);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

    init();
    draw();
  },

  // 导航栏滚动效果
  initNavbar() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;

    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    });
  },

  // 导航滚动高亮：当前所在 section 的锚点高亮
  initScrollSpy() {
    const links = document.querySelectorAll('.nav-links a[href^="#"]');
    if (!links.length) return;

    const map = {};
    links.forEach(link => {
      const id = link.getAttribute('href').slice(1);
      const section = document.getElementById(id);
      if (section) map[id] = link;
    });

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          links.forEach(l => l.classList.remove('active'));
          const link = map[entry.target.id];
          if (link) link.classList.add('active');
        }
      });
    }, { rootMargin: '-40% 0px -55% 0px' });

    Object.keys(map).forEach(id => observer.observe(document.getElementById(id)));
  },

  // 回到顶部按钮
  initBackToTop() {
    const btn = document.getElementById('back-to-top');
    if (!btn) return;

    window.addEventListener('scroll', () => {
      if (window.scrollY > 400) {
        btn.classList.add('visible');
      } else {
        btn.classList.remove('visible');
      }
    });

    btn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  },

  // 移动端菜单
  initMobileMenu() {
    const btn = document.getElementById('mobile-menu-btn');
    const menu = document.getElementById('mobile-nav');
    if (!btn || !menu) return;

    btn.addEventListener('click', () => {
      menu.classList.toggle('active');
      const icon = btn.querySelector('i');
      if (menu.classList.contains('active')) {
        icon.className = 'fa-solid fa-xmark';
      } else {
        icon.className = 'fa-solid fa-bars';
      }
    });

    // 点击导航链接关闭
    menu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        menu.classList.remove('active');
        btn.querySelector('i').className = 'fa-solid fa-bars';
      });
    });
  }
};
