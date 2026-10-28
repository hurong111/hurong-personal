/**
 * 图片轮播模块
 */

const Carousel = {
  currentIndex: 0,
  timer: null,
  slides: [],
  dots: [],

  init(containerId, options = {}) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const track = container.querySelector('.carousel-track');
    this.slides = Array.from(track.children);
    const total = this.slides.length;

    // 创建指示器
    const dotsContainer = container.querySelector('.carousel-dots');
    this.dots = [];
    for (let i = 0; i < total; i++) {
      const dot = document.createElement('div');
      dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
      dot.addEventListener('click', () => this.goTo(i));
      dotsContainer.appendChild(dot);
      this.dots.push(dot);
    }

    // 按钮
    container.querySelector('.carousel-prev').addEventListener('click', () => this.prev());
    container.querySelector('.carousel-next').addEventListener('click', () => this.next());

    // 自动播放
    if (options.auto !== false) {
      this.startAuto();
      container.addEventListener('mouseenter', () => this.stopAuto());
      container.addEventListener('mouseleave', () => this.startAuto());
    }
  },

  goTo(index) {
    const total = this.slides.length;
    this.currentIndex = ((index % total) + total) % total;

    const track = document.querySelector('.carousel-track');
    track.style.transform = `translateX(-${this.currentIndex * 100}%)`;

    // 更新指示器
    this.dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === this.currentIndex);
    });
  },

  next() {
    this.goTo(this.currentIndex + 1);
  },

  prev() {
    this.goTo(this.currentIndex - 1);
  },

  startAuto() {
    if (this.timer) return;
    this.timer = setInterval(() => this.next(), 4000);
  },

  stopAuto() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }
};
