/**
 * 硬件探索者 - 功能增强模块
 * 提供搜索、导航、阅读进度、笔记等增强功能
 * @version 2.0.0
 */

const HardwareEnhancer = {
  // 配置项
  config: {
    storagePrefix: 'hardware_explorer_',
    maxSearchResults: 10,
    autoSaveInterval: 30000,
    scrollThrottle: 100
  },

  // 初始化
  init() {
    this.initSearch();
    this.initReadingProgress();
    this.initQuickNavigation();
    this.initBookmarks();
    this.initNotes();
    this.initTheme();
    this.initAutoSave();
    console.log('[HardwareEnhancer] 初始化完成');
  },

  // ========== 全文搜索功能 ==========
  initSearch() {
    const searchInput = document.getElementById('globalSearch');
    if (!searchInput) return;

    // 搜索索引
    this.searchIndex = [
      { title: 'CPU 深度解析', content: 'CPU 架构 核心 线程 缓存 制程 超频', url: 'articles/cpu-deep-dive.html', category: '文章' },
      { title: 'GPU 技术详解', content: 'GPU 渲染 光线追踪 CUDA 显存 显卡', url: 'articles/gpu-deep-dive.html', category: '文章' },
      { title: '内存技术进阶', content: 'DDR 内存 时序 超频 双通道', url: 'articles/ram-advanced-guide.html', category: '文章' },
      { title: '硬件发展史', content: '历史 时间线 CPU GPU 内存 发展', url: 'hardware-history.html', category: '页面' },
      { title: '品牌大全', content: 'Intel AMD NVIDIA 华硕 微星 技嘉 品牌', url: 'brands.html', category: '页面' },
      { title: '术语词典', content: '术语 名词解释 缩写 专业词汇', url: 'glossary.html', category: '工具' },
      { title: '天梯图', content: '排行榜 性能对比 CPU GPU 排名', url: 'tier-list.html', category: '工具' }
    ];

    searchInput.addEventListener('input', (e) => {
      const query = e.target.value.trim().toLowerCase();
      if (query.length < 2) {
        this.hideSearchResults();
        return;
      }

      const results = this.searchIndex.filter(item => 
        item.title.toLowerCase().includes(query) || 
        item.content.toLowerCase().includes(query)
      ).slice(0, this.config.maxSearchResults);

      this.showSearchResults(results, query);
    });

    // 点击外部关闭搜索结果
    document.addEventListener('click', (e) => {
      if (!e.target.closest('#globalSearch') && !e.target.closest('#searchResults')) {
        this.hideSearchResults();
      }
    });
  },

  showSearchResults(results, query) {
    let container = document.getElementById('searchResults');
    if (!container) {
      container = document.createElement('div');
      container.id = 'searchResults';
      container.className = 'fixed top-20 right-4 w-96 bg-[#101a29] border border-cyan-500/30 rounded-xl shadow-2xl z-50 max-h-[70vh] overflow-y-auto';
      document.body.appendChild(container);
    }

    container.innerHTML = `
      <div class="p-4 border-b border-cyan-500/20">
        <div class="flex items-center justify-between">
          <h3 class="text-white font-bold">搜索结果</h3>
          <button onclick="HardwareEnhancer.hideSearchResults()" class="text-gray-400 hover:text-white">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <p class="text-xs text-gray-400 mt-1">找到 ${results.length} 条结果</p>
      </div>
      <div class="p-2">
        ${results.length > 0 ? results.map(item => `
          <a href="${item.url}" class="block p-3 hover:bg-cyan-900/20 rounded-lg transition group">
            <div class="flex items-start justify-between">
              <div class="flex-1">
                <h4 class="text-cyan-400 font-bold group-hover:text-cyan-300">${this.highlightText(item.title, query)}</h4>
                <p class="text-xs text-gray-400 mt-1">${this.highlightText(item.content, query)}</p>
                <span class="inline-block mt-2 px-2 py-0.5 bg-cyan-900/30 text-cyan-400 text-xs rounded">${item.category}</span>
              </div>
              <i class="fas fa-chevron-right text-gray-500 group-hover:text-cyan-400"></i>
            </div>
          </a>
        `).join('') : `
          <div class="text-center py-8 text-gray-400">
            <i class="fas fa-search text-3xl mb-2"></i>
            <p>未找到相关结果</p>
          </div>
        `}
      </div>
    `;

    container.style.display = 'block';
  },

  hideSearchResults() {
    const container = document.getElementById('searchResults');
    if (container) container.style.display = 'none';
  },

  highlightText(text, query) {
    const regex = new RegExp(`(${query})`, 'gi');
    return text.replace(regex, '<mark class="bg-yellow-500/30 text-yellow-300 px-0.5 rounded">$1</mark>');
  },

  // ========== 阅读进度跟踪 ==========
  initReadingProgress() {
    this.progressBar = document.createElement('div');
    this.progressBar.className = 'fixed top-0 left-0 h-1 bg-gradient-to-r from-purple-500 to-cyan-500 z-[60] transition-all duration-100';
    this.progressBar.style.width = '0%';
    document.body.appendChild(this.progressBar);

    this.scrollHandler = this.throttle(() => {
      const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = (winScroll / height) * 100;
      this.progressBar.style.width = scrolled + '%';
      
      // 保存到本地存储
      const currentPage = this.getCurrentPage();
      if (currentPage) {
        localStorage.setItem(this.config.storagePrefix + 'progress_' + currentPage, scrolled);
      }
    }, this.config.scrollThrottle);

    window.addEventListener('scroll', this.scrollHandler);
  },

  // ========== 快速导航 ==========
  initQuickNavigation() {
    // 添加回到顶部按钮
    this.backToTopBtn = document.createElement('button');
    this.backToTopBtn.className = 'fixed bottom-8 right-8 w-12 h-12 bg-gradient-to-r from-purple-600 to-cyan-600 text-white rounded-full shadow-lg hover:shadow-cyan-500/50 transition-all z-50 opacity-0 invisible';
    this.backToTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    this.backToTopBtn.onclick = () => window.scrollTo({ top: 0, behavior: 'smooth' });
    document.body.appendChild(this.backToTopBtn);

    // 滚动显示/隐藏
    window.addEventListener('scroll', () => {
      if (window.scrollY > 500) {
        this.backToTopBtn.classList.remove('opacity-0', 'invisible');
      } else {
        this.backToTopBtn.classList.add('opacity-0', 'invisible');
      }
    });

    // 添加目录导航（针对文章页面）
    this.initTableOfContents();
  },

  initTableOfContents() {
    const article = document.querySelector('article') || document.querySelector('.main-content');
    if (!article) return;

    const headings = article.querySelectorAll('h2, h3');
    if (headings.length === 0) return;

    const tocContainer = document.createElement('div');
    tocContainer.className = 'fixed right-4 top-1/2 transform -translate-y-1/2 bg-[#101a29]/90 border border-cyan-500/30 rounded-xl p-4 z-40 hidden lg:block max-h-[60vh] overflow-y-auto';
    
    let tocHTML = '<h4 class="text-white font-bold mb-3 text-sm"><i class="fas fa-list mr-2"></i>目录</h4><ul class="space-y-2 text-sm">';
    headings.forEach((heading, index) => {
      const id = 'heading-' + index;
      heading.id = id;
      const level = heading.tagName === 'H2' ? 'font-bold' : 'pl-4';
      tocHTML += `<li><a href="#${id}" class="block ${level} text-gray-300 hover:text-cyan-400 transition">${heading.textContent}</a></li>`;
    });
    tocHTML += '</ul>';

    tocContainer.innerHTML = tocHTML;
    document.body.appendChild(tocContainer);
  },

  // ========== 书签功能 ==========
  initBookmarks() {
    const bookmarkBtn = document.createElement('button');
    bookmarkBtn.className = 'fixed bottom-8 right-20 w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full shadow-lg hover:shadow-purple-500/50 transition-all z-50';
    bookmarkBtn.innerHTML = '<i class="fas fa-bookmark"></i>';
    bookmarkBtn.onclick = () => this.toggleBookmark();
    bookmarkBtn.title = '添加书签';
    document.body.appendChild(bookmarkBtn);

    // 检查当前页面是否已添加书签
    const currentPage = this.getCurrentPage();
    if (currentPage && this.isBookmarked(currentPage)) {
      bookmarkBtn.innerHTML = '<i class="fas fa-bookmark text-yellow-400"></i>';
    }
  },

  toggleBookmark() {
    const currentPage = this.getCurrentPage();
    if (!currentPage) return;

    const bookmarks = this.getBookmarks();
    const index = bookmarks.indexOf(currentPage);

    if (index > -1) {
      bookmarks.splice(index, 1);
      alert('已移除书签');
    } else {
      bookmarks.push(currentPage);
      alert('已添加书签');
    }

    localStorage.setItem(this.config.storagePrefix + 'bookmarks', JSON.stringify(bookmarks));
  },

  getBookmarks() {
    try {
      return JSON.parse(localStorage.getItem(this.config.storagePrefix + 'bookmarks')) || [];
    } catch {
      return [];
    }
  },

  isBookmarked(page) {
    return this.getBookmarks().includes(page);
  },

  // ========== 笔记功能 ==========
  initNotes() {
    const notesBtn = document.createElement('button');
    notesBtn.className = 'fixed bottom-24 right-8 w-12 h-12 bg-gradient-to-r from-green-600 to-cyan-600 text-white rounded-full shadow-lg hover:shadow-cyan-500/50 transition-all z-50';
    notesBtn.innerHTML = '<i class="fas fa-sticky-note"></i>';
    notesBtn.onclick = () => this.showNotesPanel();
    notesBtn.title = '我的笔记';
    document.body.appendChild(notesBtn);
  },

  showNotesPanel() {
    const panel = document.createElement('div');
    panel.className = 'fixed inset-0 bg-black/50 z-[70] flex items-center justify-center';
    panel.innerHTML = `
      <div class="bg-[#101a29] border border-cyan-500/30 rounded-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden">
        <div class="p-4 border-b border-cyan-500/20 flex items-center justify-between">
          <h3 class="text-white font-bold text-lg"><i class="fas fa-sticky-note mr-2"></i>我的笔记</h3>
          <button onclick="this.closest('.fixed').remove()" class="text-gray-400 hover:text-white">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="p-4 overflow-y-auto max-h-[60vh]">
          <textarea class="w-full h-64 bg-black/30 border border-cyan-500/30 rounded-lg p-3 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500" 
            placeholder="在这里记录你的学习笔记..."></textarea>
          <div class="mt-4 flex justify-end">
            <button onclick="HardwareEnhancer.saveNote(this)" class="px-6 py-2 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-lg text-white font-bold hover:opacity-90">
              <i class="fas fa-save mr-2"></i>保存笔记
            </button>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(panel);
  },

  saveNote(btn) {
    const textarea = btn.parentElement.previousElementSibling.querySelector('textarea');
    const note = textarea.value.trim();
    if (!note) {
      alert('请输入笔记内容');
      return;
    }

    const notes = this.getNotes();
    notes.push({
      page: this.getCurrentPage(),
      content: note,
      timestamp: new Date().toISOString()
    });

    localStorage.setItem(this.config.storagePrefix + 'notes', JSON.stringify(notes));
    alert('笔记已保存');
    textarea.value = '';
  },

  getNotes() {
    try {
      return JSON.parse(localStorage.getItem(this.config.storagePrefix + 'notes')) || [];
    } catch {
      return [];
    }
  },

  // ========== 主题切换 ==========
  initTheme() {
    const theme = localStorage.getItem(this.config.storagePrefix + 'theme') || 'dark';
    document.body.setAttribute('data-theme', theme);
  },

  // ========== 自动保存 ==========
  initAutoSave() {
    setInterval(() => {
      const currentPage = this.getCurrentPage();
      if (!currentPage) return;

      localStorage.setItem(this.config.storagePrefix + 'lastVisit_' + currentPage, new Date().toISOString());
      localStorage.setItem(this.config.storagePrefix + 'lastPage', currentPage);
    }, this.config.autoSaveInterval);
  },

  // ========== 工具方法 ==========
  getCurrentPage() {
    const path = window.location.pathname;
    return path.split('/').pop() || 'index.html';
  },

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

  // ========== 统计功能 ==========
  trackPageView() {
    const page = this.getCurrentPage();
    const views = JSON.parse(localStorage.getItem(this.config.storagePrefix + 'views') || '{}');
    views[page] = (views[page] || 0) + 1;
    localStorage.setItem(this.config.storagePrefix + 'views', JSON.stringify(views));
  }
};

// 页面加载完成后初始化
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => HardwareEnhancer.init());
} else {
  HardwareEnhancer.init();
}

// 页面访问统计
HardwareEnhancer.trackPageView();
