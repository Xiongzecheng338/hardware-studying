/**
 * 硬件探索者 - 核心功能增强版
 * 整合动画、图表、搜索、数据可视化等功能
 * @version 3.0.0
 */

// ========== 全局配置 ==========
const APP_CONFIG = {
  version: '3.0.0',
  apiBase: 'src/data/',
  cacheEnabled: true,
  debug: true
};

// ========== 工具函数库 ==========
const Utils = {
  // 防抖
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },

  // 节流
  throttle(func, limit) {
    let inThrottle;
    return function(...args) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  },

  // 格式化数字
  formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  },

  // 格式化日期
  formatDate(date) {
    return new Intl.DateTimeFormat('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(date));
  },

  // 本地存储封装
  storage: {
    get(key) {
      try {
        return JSON.parse(localStorage.getItem(key));
      } catch {
        return null;
      }
    },
    set(key, value) {
      localStorage.setItem(key, JSON.stringify(value));
    },
    remove(key) {
      localStorage.removeItem(key);
    }
  },

  // 获取 URL 参数
  getQueryParam(name) {
    const params = new URLSearchParams(window.location.search);
    return params.get(name);
  }
};

// ========== 数据服务层 ==========
const DataService = {
  cache: new Map(),

  async fetch(endpoint, options = {}) {
    const cacheKey = `${endpoint}_${JSON.stringify(options)}`;
    
    // 检查缓存
    if (APP_CONFIG.cacheEnabled && this.cache.has(cacheKey)) {
      console.log('[DataService] 从缓存读取:', endpoint);
      return this.cache.get(cacheKey);
    }

    try {
      const response = await fetch(`${APP_CONFIG.apiBase}${endpoint}`, options);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      
      const data = await response.json();
      
      // 缓存结果
      if (APP_CONFIG.cacheEnabled) {
        this.cache.set(cacheKey, data);
      }
      
      return data;
    } catch (error) {
      console.error('[DataService] 请求失败:', error);
      throw error;
    }
  },

  // 加载硬件数据
  async loadHardwareData(category) {
    return this.fetch('hardware.json');
  },

  // 加载文章数据
  async loadArticles() {
    return this.fetch('articles.json');
  }
};

// ========== 动画系统 ==========
const AnimationSystem = {
  init() {
    this.initScrollAnimations();
    this.initCounterAnimations();
    this.initParallax();
  },

  // 滚动动画
  initScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const element = entry.target;
          const animation = element.dataset.animation || 'fade-up';
          
          element.classList.add('animate__animated', `animate__${animation}`);
          observer.unobserve(element);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '50px'
    });

    document.querySelectorAll('[data-animation]').forEach(el => {
      el.style.opacity = '0';
      observer.observe(el);
    });
  },

  // 数字动画
  initCounterAnimations() {
    const counters = document.querySelectorAll('[data-counter]');
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const element = entry.target;
          const target = parseInt(element.dataset.counter);
          const duration = parseInt(element.dataset.duration) || 2000;
          
          this.animateCounter(element, target, duration);
          observer.unobserve(element);
        }
      });
    });

    counters.forEach(counter => observer.observe(counter));
  },

  animateCounter(element, target, duration) {
    const start = 0;
    const startTime = performance.now();
    
    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeProgress = 1 - Math.pow(1 - progress, 3); // easeOutCubic
      const current = Math.floor(start + (target - start) * easeProgress);
      
      element.textContent = Utils.formatNumber(current);
      
      if (progress < 1) {
        requestAnimationFrame(update);
      }
    }
    
    requestAnimationFrame(update);
  },

  // 视差效果
  initParallax() {
    let ticking = false;
    
    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrolled = window.pageYOffset;
          document.querySelectorAll('[data-parallax]').forEach(el => {
            const speed = parseFloat(el.dataset.parallax) || 0.5;
            el.style.transform = `translateY(${scrolled * speed}px)`;
          });
          ticking = false;
        });
        ticking = true;
      }
    });
  }
};

// ========== 图表系统 ==========
const ChartSystem = {
  charts: new Map(),

  // 创建柱状图
  createBarChart(canvasId, data, options = {}) {
    const ctx = document.getElementById(canvasId);
    if (!ctx) return null;

    const chart = new Chart(ctx, {
      type: 'bar',
      data: data,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: options.legendPosition || 'top',
            labels: { color: '#94a3b8' }
          },
          title: {
            display: !!options.title,
            text: options.title,
            color: '#ffffff',
            font: { size: 16 }
          }
        },
        scales: {
          y: {
            grid: { color: 'rgba(148, 163, 184, 0.1)' },
            ticks: { color: '#94a3b8' }
          },
          x: {
            grid: { display: false },
            ticks: { color: '#94a3b8' }
          }
        },
        ...options.chartOptions
      }
    });

    this.charts.set(canvasId, chart);
    return chart;
  },

  // 创建折线图
  createLineChart(canvasId, data, options = {}) {
    const ctx = document.getElementById(canvasId);
    if (!ctx) return null;

    const chart = new Chart(ctx, {
      type: 'line',
      data: data,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: options.legendPosition || 'top',
            labels: { color: '#94a3b8' }
          }
        },
        scales: {
          y: {
            grid: { color: 'rgba(148, 163, 184, 0.1)' },
            ticks: { color: '#94a3b8' }
          },
          x: {
            grid: { display: false },
            ticks: { color: '#94a3b8' }
          }
        },
        ...options.chartOptions
      }
    });

    this.charts.set(canvasId, chart);
    return chart;
  },

  // 创建雷达图
  createRadarChart(canvasId, data, options = {}) {
    const ctx = document.getElementById(canvasId);
    if (!ctx) return null;

    const chart = new Chart(ctx, {
      type: 'radar',
      data: data,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
            labels: { color: '#94a3b8' }
          }
        },
        scales: {
          r: {
            grid: { color: 'rgba(148, 163, 184, 0.2)' },
            pointLabels: { color: '#94a3b8' }
          }
        },
        ...options.chartOptions
      }
    });

    this.charts.set(canvasId, chart);
    return chart;
  },

  // 销毁图表
  destroyChart(canvasId) {
    const chart = this.charts.get(canvasId);
    if (chart) {
      chart.destroy();
      this.charts.delete(canvasId);
    }
  }
};

// ========== 搜索系统 (增强版) ==========
const SearchSystem = {
  index: [],
  isInitialized: false,

  async init() {
    if (this.isInitialized) return;

    try {
      // 加载搜索索引
      const response = await fetch('src/data/search-index.json');
      const data = await response.json();
      this.index = data;
      this.isInitialized = true;
      console.log('[SearchSystem] 初始化完成，索引数量:', this.index.length);
    } catch (error) {
      console.error('[SearchSystem] 初始化失败:', error);
    }
  },

  search(query, options = {}) {
    const { limit = 10, fuzzy = false } = options;
    const queryLower = query.toLowerCase().trim();

    if (queryLower.length < 2) return [];

    const results = this.index.filter(item => {
      const titleMatch = item.title.toLowerCase().includes(queryLower);
      const contentMatch = item.content.toLowerCase().includes(queryLower);
      const keywordMatch = item.keywords?.some(k => k.toLowerCase().includes(queryLower));
      
      return titleMatch || contentMatch || keywordMatch;
    }).slice(0, limit);

    return results;
  },

  highlight(text, query) {
    const regex = new RegExp(`(${query})`, 'gi');
    return text.replace(regex, '<mark class="bg-yellow-500/30 text-yellow-300 px-1 rounded">$1</mark>');
  }
};

// ========== UI 组件系统 ==========
const UIComponents = {
  // 通知提示
  notify(message, type = 'info', duration = 3000) {
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 z-[100] px-6 py-4 rounded-xl shadow-2xl transform transition-all duration-300 translate-x-full opacity-0`;
    
    const colors = {
      success: 'bg-green-600/90 border border-green-400/30',
      error: 'bg-red-600/90 border border-red-400/30',
      warning: 'bg-yellow-600/90 border border-yellow-400/30',
      info: 'bg-cyan-600/90 border border-cyan-400/30'
    };

    const icons = {
      success: 'fa-check-circle',
      error: 'fa-exclamation-circle',
      warning: 'fa-exclamation-triangle',
      info: 'fa-info-circle'
    };

    notification.innerHTML = `
      <div class="flex items-center gap-3 text-white">
        <i class="fas ${icons[type]}"></i>
        <span>${message}</span>
      </div>
    `;
    notification.classList.add(colors[type]);

    document.body.appendChild(notification);

    // 动画显示
    requestAnimationFrame(() => {
      notification.classList.remove('translate-x-full', 'opacity-0');
    });

    // 自动隐藏
    setTimeout(() => {
      notification.classList.add('translate-x-full', 'opacity-0');
      setTimeout(() => notification.remove(), 300);
    }, duration);
  },

  // 确认对话框
  async confirm(message, options = {}) {
    return new Promise((resolve) => {
      const overlay = document.createElement('div');
      overlay.className = 'fixed inset-0 bg-black/70 z-[99] flex items-center justify-center backdrop-blur-sm';
      
      overlay.innerHTML = `
        <div class="bg-[#101a29] border border-cyan-500/30 rounded-2xl p-6 max-w-md mx-4 transform transition-all scale-95 opacity-0">
          <div class="text-center">
            <div class="w-16 h-16 mx-auto mb-4 rounded-full bg-cyan-600/20 flex items-center justify-center">
              <i class="fas fa-question text-2xl text-cyan-400"></i>
            </div>
            <h3 class="text-xl font-bold text-white mb-4">${message}</h3>
            <div class="flex gap-3 justify-center">
              <button class="confirm-cancel px-6 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white transition">
                取消
              </button>
              <button class="confirm-ok px-6 py-2 bg-gradient-to-r from-cyan-600 to-purple-600 hover:opacity-90 rounded-lg text-white transition">
                确认
              </button>
            </div>
          </div>
        </div>
      `;

      document.body.appendChild(overlay);

      // 动画显示
      requestAnimationFrame(() => {
        const modal = overlay.querySelector('div');
        modal.classList.remove('scale-95', 'opacity-0');
      });

      // 按钮事件
      overlay.querySelector('.confirm-cancel').addEventListener('click', () => {
        overlay.remove();
        resolve(false);
      });

      overlay.querySelector('.confirm-ok').addEventListener('click', () => {
        overlay.remove();
        resolve(true);
      });
    });
  },

  // 加载状态
  showLoading(container, message = '加载中...') {
    const loader = document.createElement('div');
    loader.className = 'flex flex-col items-center justify-center p-8';
    loader.innerHTML = `
      <div class="w-12 h-12 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin mb-4"></div>
      <div class="text-cyan-400">${message}</div>
    `;
    container.appendChild(loader);
    return loader;
  },

  hideLoading(loader) {
    if (loader && loader.parentNode) {
      loader.remove();
    }
  }
};

// ========== 页面管理器 ==========
const PageManager = {
  currentPage: '',

  init() {
    this.currentPage = window.location.pathname.split('/').pop() || 'index.html';
    console.log('[PageManager] 当前页面:', this.currentPage);
    
    this.initPageSpecificFeatures();
  },

  initPageSpecificFeatures() {
    // 根据页面加载特定功能
    const pageFeatures = {
      'index.html': () => this.initHome(),
      'encyclopedia.html': () => this.initEncyclopedia(),
      'tier-list.html': () => this.initTierList(),
      'builds.html': () => this.initBuilds(),
      'glossary.html': () => this.initGlossary()
    };

    const feature = pageFeatures[this.currentPage];
    if (feature) {
      feature();
    }
  },

  initHome() {
    console.log('[PageManager] 初始化首页功能');
    // 初始化首页特有的功能
  },

  initEncyclopedia() {
    console.log('[PageManager] 初始化百科功能');
    // 百科筛选、搜索等
  },

  initTierList() {
    console.log('[PageManager] 初始化天梯图功能');
    // 天梯图排序、对比等
  },

  initBuilds() {
    console.log('[PageManager] 初始化配置推荐功能');
    // 配置筛选、对比等
  },

  initGlossary() {
    console.log('[PageManager] 初始化术语词典功能');
    // 术语搜索、分类等
  }
};

// ========== 性能监控 ==========
const PerformanceMonitor = {
  metrics: {},

  init() {
    this.trackLoadTime();
    this.trackInteraction();
  },

  trackLoadTime() {
    window.addEventListener('load', () => {
      const timing = performance.timing;
      this.metrics.loadTime = timing.loadEventEnd - timing.navigationStart;
      this.metrics.domReady = timing.domContentLoadedEventEnd - timing.navigationStart;
      
      console.log('[Performance] 页面加载时间:', this.metrics.loadTime, 'ms');
      console.log('[Performance] DOM 就绪时间:', this.metrics.domReady, 'ms');
    });
  },

  trackInteraction() {
    let clickCount = 0;
    let scrollDepth = 0;

    document.addEventListener('click', () => clickCount++);
    
    window.addEventListener('scroll', Utils.throttle(() => {
      const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      scrollDepth = Math.max(scrollDepth, (winScroll / height) * 100);
    }, 500));

    // 离开页面时上报
    window.addEventListener('beforeunload', () => {
      this.metrics.clickCount = clickCount;
      this.metrics.scrollDepth = scrollDepth;
      console.log('[Performance] 用户行为数据:', this.metrics);
    });
  }
};

// ========== 主初始化函数 ==========
function initApp() {
  console.log(`[App] 硬件探索者 v${APP_CONFIG.version} 初始化`);
  
  // 初始化各系统
  AnimationSystem.init();
  PageManager.init();
  PerformanceMonitor.init();
  
  // 注册全局工具
  window.Utils = Utils;
  window.UI = UIComponents;
  window.Search = SearchSystem;
  window.Charts = ChartSystem;
  
  console.log('[App] 初始化完成');
}

// 页面加载完成后初始化
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}

// 导出模块 (供其他文件使用)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    Utils,
    DataService,
    AnimationSystem,
    ChartSystem,
    SearchSystem,
    UIComponents,
    PageManager,
    PerformanceMonitor
  };
}
