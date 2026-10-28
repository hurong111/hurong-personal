/**
 * 音乐播放器模块
 * 注意：这是一个视觉组件，没有实际音频文件
 * 用户可以点击播放按钮，会显示动画效果
 */

const MusicPlayer = {
  isPlaying: false,
  audio: null,

  init() {
    const container = document.getElementById('music-player');
    if (!container) return;

    // 尝试加载背景音乐（如果存在）
    // 静默模式：音频加载失败不报错，仅显示动画效果
    try {
      this.audio = new Audio();
      this.audio.preload = 'none';
      this.audio.loop = true;
      this.audio.volume = 0.4;
      // 只有文件存在时才设置 src
      fetch('assets/audio/bgm.mp3', { method: 'HEAD' })
        .then(res => {
          if (res.ok) this.audio.src = 'assets/audio/bgm.mp3';
        })
        .catch(() => { /* 文件不存在，保持视觉模式 */ });
    } catch (e) {
      this.audio = null;
    }

    const btn = container.querySelector('.music-btn');
    btn.addEventListener('click', () => this.toggle());

    // 首次用户交互后才能播放
    document.addEventListener('click', () => {
      if (this.audio && this.isPlaying) {
        this.audio.play().catch(() => {});
      }
    }, { once: true });
  },

  toggle() {
    const container = document.getElementById('music-player');
    const btn = container.querySelector('.music-btn');
    const icon = btn.querySelector('i');

    this.isPlaying = !this.isPlaying;

    if (this.isPlaying) {
      btn.classList.add('playing');
      icon.className = 'fa-solid fa-pause';
      if (this.audio) {
        this.audio.play().catch(() => {});
      }
    } else {
      btn.classList.remove('playing');
      icon.className = 'fa-solid fa-music';
      if (this.audio) {
        this.audio.pause();
      }
    }
  }
};
