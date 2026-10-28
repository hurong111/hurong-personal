/**
 * 主题切换模块
 */

const ThemeManager = {
  init() {
    const saved = localStorage.getItem('hr_site_theme') || 'light';
    this.setTheme(saved);

    // 绑定切换按钮
    const toggleBtn = document.getElementById('theme-toggle');
    if (toggleBtn) {
      toggleBtn.addEventListener('click', () => this.toggle());
    }
  },

  setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('hr_site_theme', theme);

    // 更新按钮图标
    const toggleBtn = document.getElementById('theme-toggle');
    if (toggleBtn) {
      const icon = toggleBtn.querySelector('i');
      if (icon) {
        icon.className = theme === 'light' ? 'fa-solid fa-moon' : 'fa-solid fa-sun';
      }
    }
  },

  toggle() {
    const current = document.documentElement.getAttribute('data-theme') || 'light';
    const next = current === 'light' ? 'dark' : 'light';
    this.setTheme(next);
  },

  current() {
    return document.documentElement.getAttribute('data-theme') || 'light';
  }
};
