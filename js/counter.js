/**
 * 访客统计模块
 * 使用 localStorage 模拟
 * 每次新会话（sessionStorage中没有标记）时计数+1
 */

const VisitorCounter = {
  init() {
    // 每次新的浏览器会话 +1
    if (!sessionStorage.getItem('hr_site_visited')) {
      api.incrementVisitorCount();
      sessionStorage.setItem('hr_site_visited', 'true');
    }

    this.updateDisplay();
  },

  updateDisplay() {
    const count = api.getVisitorCount();
    const display = document.getElementById('visitor-count');
    if (display) {
      display.textContent = this.formatCount(count);
    }
  },

  formatCount(n) {
    // 模拟一个更丰富的数字（加上一些基数）
    const base = 1247; // 模拟历史访客基数
    return (base + n).toString().padStart(5, '0');
  }
};
