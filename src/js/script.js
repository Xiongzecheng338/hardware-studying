function navigateTo(pageName) {
  const validPages = ['index', 'learning-path', 'beginner-guide', 'encyclopedia', 'mobile-hardware', 'other-devices', 'builder', 'quiz', 'achievements'];
  if (validPages.includes(pageName)) {
    window.location.href = `${pageName}.html`;
  }
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function sanitizeInput(input) {
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
    .replace(/\n/g, '<br>');
}

function initNavigation() {
  const currentPage = window.location.pathname.split('/').pop().replace('.html', '');
  const pageName = currentPage || 'index';
  
  const navItems = document.querySelectorAll('.nav-item');
  navItems.forEach(item => {
    const pageId = item.dataset.page;
    if (pageId === pageName) {
      item.classList.add('active');
    }
  });
  
  const mobileNavItems = document.querySelectorAll('.mobile-nav > div[data-mobile]');
  mobileNavItems.forEach(item => {
    const pageId = item.dataset.mobile;
    if (pageId === pageName) {
      item.classList.add('active');
    }
  });
}

function initSidebar() {
  const sidebar = document.querySelector('.sidebar');
  const mainContent = document.querySelector('main');
  const toggleBtn = document.querySelector('.sidebar-toggle');
  
  if (!sidebar || !toggleBtn) return;
  
  const isCollapsed = localStorage.getItem('sidebarCollapsed') === 'true';
  if (isCollapsed) {
    sidebar.classList.add('collapsed');
    if (mainContent) mainContent.classList.add('sidebar-collapsed');
  }
  
  toggleBtn.addEventListener('click', function() {
    sidebar.classList.toggle('collapsed');
    if (mainContent) mainContent.classList.toggle('sidebar-collapsed');
    localStorage.setItem('sidebarCollapsed', sidebar.classList.contains('collapsed'));
  });
  
  const navItems = sidebar.querySelectorAll('.nav-item');
  navItems.forEach(item => {
    item.addEventListener('mouseenter', function() {
      if (sidebar.classList.contains('collapsed')) {
        const tooltip = this.querySelector('.nav-text')?.textContent;
        if (tooltip) {
          this.setAttribute('title', tooltip);
        }
      }
    });
  });
}

function initMobileNav() {
  const moreBtn = document.querySelector('.mobile-nav-more');
  const morePopup = document.querySelector('.mobile-nav-more-popup');
  
  if (!moreBtn || !morePopup) return;
  
  moreBtn.addEventListener('click', function(e) {
    e.stopPropagation();
    morePopup.classList.toggle('show');
  });
  
  document.addEventListener('click', function(e) {
    if (!moreBtn.contains(e.target) && !morePopup.contains(e.target)) {
      morePopup.classList.remove('show');
    }
  });
  
  const popupItems = morePopup.querySelectorAll('.mobile-nav-more-popup-item');
  popupItems.forEach(item => {
    item.addEventListener('click', function() {
      const page = this.dataset.page;
      if (page) {
        navigateTo(page);
      }
      morePopup.classList.remove('show');
    });
  });
}

document.addEventListener('DOMContentLoaded', function() {
  initNavigation();
  initSidebar();
  initMobileNav();
  initParticles();
  updateProgress();
  initComments();
  
  const filterTags = document.querySelectorAll('.filter-tag');
  const hardwareCards = document.querySelectorAll('.hardware-card');
  
  if (filterTags.length > 0) {
    filterTags.forEach(tag => {
      tag.addEventListener('click', function() {
        filterTags.forEach(t => t.classList.remove('active', 'bg-[var(--accent-cyan)]/20', 'text-[var(--accent-cyan)]', 'border-[var(--accent-cyan)]/30'));
        filterTags.forEach(t => t.classList.add('bg-white/5', 'text-[var(--text-secondary)]', 'border-white/10'));
        this.classList.add('active', 'bg-[var(--accent-cyan)]/20', 'text-[var(--accent-cyan)]', 'border-[var(--accent-cyan)]/30');
        this.classList.remove('bg-white/5', 'text-[var(--text-secondary)]', 'border-white/10');
        
        const filter = this.dataset.filter;
        
        hardwareCards.forEach(card => {
          if (filter === 'all' || card.dataset.category === filter) {
            card.style.display = 'block';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
    
    hardwareCards.forEach(card => {
      card.addEventListener('click', function() {
        const hardwareType = this.dataset.hardware;
        showHardwareModal(hardwareType);
      });
    });
  }
});

function initParticles() {
  const canvas = document.getElementById('particles');
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  
  let canvasWidth = window.innerWidth;
  let canvasHeight = window.innerHeight;
  canvas.width = canvasWidth;
  canvas.height = canvasHeight;
  
  const particles = [];
  const particleCount = Math.min(50, Math.floor((canvasWidth * canvasHeight) / 20000));
  
  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: Math.random() * canvasWidth,
      y: Math.random() * canvasHeight,
      size: Math.random() * 2 + 1,
      speedX: Math.random() * 0.5 - 0.25,
      speedY: Math.random() * 0.5 - 0.25,
      color: `rgba(0, 229, 204, ${Math.random() * 0.5 + 0.1})`
    });
  }
  
  let animationId = null;
  let isVisible = true;
  
  function animate() {
    if (!isVisible) {
      animationId = requestAnimationFrame(animate);
      return;
    }
    
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
      
      p.x += p.speedX;
      p.y += p.speedY;
      
      if (p.x < 0 || p.x > canvasWidth) p.speedX *= -1;
      if (p.y < 0 || p.y > canvasHeight) p.speedY *= -1;
    }
    
    animationId = requestAnimationFrame(animate);
  }
  
  animate();
  
  let resizeTimeout;
  window.addEventListener('resize', function() {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(function() {
      canvasWidth = window.innerWidth;
      canvasHeight = window.innerHeight;
      canvas.width = canvasWidth;
      canvas.height = canvasHeight;
    }, 100);
  });
  
  document.addEventListener('visibilitychange', function() {
    isVisible = !document.hidden;
  });
}

function showHardwareModal(hardwareType) {
  console.log('Showing modal for:', hardwareType);
}

function updateProgress() {
  const progress = 0;
  const progressBar = document.getElementById('progressBar');
  const progressText = document.getElementById('progressText');
  
  if (progressBar) progressBar.style.width = `${progress}%`;
  if (progressText) progressText.textContent = `${progress}%`;
}

function initComments() {
  const commentForms = document.querySelectorAll('.comment-form');
  commentForms.forEach(form => {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      const commentText = this.querySelector('.comment-input').value;
      
      if (!commentText.trim()) {
        alert('请输入评论内容');
        return;
      }
      
      console.log('Comment submitted:', { content: commentText });
      
      addComment('访客用户', commentText);
      
      this.querySelector('.comment-input').value = '';
    });
  });
  
  document.querySelectorAll('.comment-button.reply').forEach(button => {
    button.addEventListener('click', function() {
      const commentItem = this.closest('.comment-item');
      const replyForm = commentItem.querySelector('.comment-reply-form');
      replyForm.classList.toggle('active');
    });
  });
  
  document.querySelectorAll('.comment-reply-form').forEach(form => {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      const replyText = this.querySelector('.reply-input').value;
      const commentItem = this.closest('.comment-item');
      const parentAuthor = commentItem.querySelector('.comment-author').textContent;
      
      if (!replyText.trim()) {
        alert('请输入回复内容');
        return;
      }
      
      console.log('Reply submitted:', { content: replyText, parent: parentAuthor });
      
      addReply(commentItem, '访客用户', replyText);
      
      this.querySelector('.reply-input').value = '';
      this.classList.remove('active');
    });
  });
  
  document.querySelectorAll('.comment-button.delete').forEach(button => {
    button.addEventListener('click', function() {
      if (confirm('确定要删除这条评论吗？')) {
        const commentItem = this.closest('.comment-item');
        commentItem.remove();
      }
    });
  });
}

function addComment(author, content) {
  const commentsList = document.querySelector('.comments-list');
  if (!commentsList) return;
  
  const sanitizedAuthor = escapeHtml(author);
  const sanitizedContent = sanitizeInput(content);
  const timestamp = new Date().toLocaleString();
  
  const commentElement = document.createElement('div');
  commentElement.className = 'comment-item';
  
  const headerDiv = document.createElement('div');
  headerDiv.className = 'comment-header';
  
  const authorSpan = document.createElement('span');
  authorSpan.className = 'comment-author';
  authorSpan.innerHTML = `<i class="fas fa-user-circle"></i> ${sanitizedAuthor}`;
  
  const timeSpan = document.createElement('span');
  timeSpan.className = 'comment-time';
  timeSpan.textContent = timestamp;
  
  headerDiv.appendChild(authorSpan);
  headerDiv.appendChild(timeSpan);
  
  const contentDiv = document.createElement('div');
  contentDiv.className = 'comment-content';
  contentDiv.innerHTML = sanitizedContent;
  
  const buttonsDiv = document.createElement('div');
  buttonsDiv.className = 'comment-buttons';
  buttonsDiv.innerHTML = `
    <button class="comment-button reply"><i class="fas fa-reply"></i> 回复</button>
    <button class="comment-button delete"><i class="fas fa-trash-alt"></i> 删除</button>
  `;
  
  const replyFormDiv = document.createElement('div');
  replyFormDiv.className = 'comment-reply-form';
  replyFormDiv.innerHTML = `
    <textarea class="reply-input" placeholder="写下你的回复..."></textarea>
    <div class="reply-actions">
      <button type="button" class="btn-secondary" onclick="this.closest('.comment-reply-form').classList.remove('active')">取消</button>
      <button type="submit" class="btn-primary">回复</button>
    </div>
  `;
  
  const repliesDiv = document.createElement('div');
  repliesDiv.className = 'comment-replies';
  
  commentElement.appendChild(headerDiv);
  commentElement.appendChild(contentDiv);
  commentElement.appendChild(buttonsDiv);
  commentElement.appendChild(replyFormDiv);
  commentElement.appendChild(repliesDiv);
  
  commentsList.appendChild(commentElement);
  
  initComments();
}

function addReply(commentItem, author, content) {
  const repliesContainer = commentItem.querySelector('.comment-replies');
  if (!repliesContainer) return;
  
  const sanitizedAuthor = escapeHtml(author);
  const sanitizedContent = sanitizeInput(content);
  const timestamp = new Date().toLocaleString();
  
  const replyElement = document.createElement('div');
  replyElement.className = 'comment-item';
  
  const headerDiv = document.createElement('div');
  headerDiv.className = 'comment-header';
  
  const authorSpan = document.createElement('span');
  authorSpan.className = 'comment-author';
  authorSpan.innerHTML = `<i class="fas fa-user-circle"></i> ${sanitizedAuthor}`;
  
  const timeSpan = document.createElement('span');
  timeSpan.className = 'comment-time';
  timeSpan.textContent = timestamp;
  
  headerDiv.appendChild(authorSpan);
  headerDiv.appendChild(timeSpan);
  
  const contentDiv = document.createElement('div');
  contentDiv.className = 'comment-content';
  contentDiv.innerHTML = sanitizedContent;
  
  const buttonsDiv = document.createElement('div');
  buttonsDiv.className = 'comment-buttons';
  buttonsDiv.innerHTML = `
    <button class="comment-button delete"><i class="fas fa-trash-alt"></i> 删除</button>
  `;
  
  replyElement.appendChild(headerDiv);
  replyElement.appendChild(contentDiv);
  replyElement.appendChild(buttonsDiv);
  
  repliesContainer.appendChild(replyElement);
  
  initComments();
}

function switchDeviceTab(tabId) {
  console.log('Switching to device tab:', tabId);
}

function initBuilder() {
  console.log('Initializing builder');
}

function initQuiz() {
  console.log('Initializing quiz');
}

function initCompare() {
  console.log('Initializing compare');
}

function initCalculator() {
  console.log('Initializing calculator');
}

function initBuilds() {
  console.log('Initializing builds');
}

function initTroubleshoot() {
  console.log('Initializing troubleshoot');
}

function initAchievements() {
  console.log('Initializing achievements');
}

function toggleExpand(element) {
  const content = element.nextElementSibling;
  if (content && content.classList.contains('expandable-content')) {
    content.classList.toggle('expanded');
    const icon = element.querySelector('i.fa-chevron-down');
    if (icon) {
      icon.style.transform = content.classList.contains('expanded') ? 'rotate(180deg)' : 'rotate(0)';
    }
  }
}

function showModal(title, content) {
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay active';
  overlay.innerHTML = `
    <div class="modal-content">
      <div class="modal-header">
        <h3 class="font-bold text-xl">${escapeHtml(title)}</h3>
        <button class="modal-close" onclick="closeModal(this)">
          <i class="fas fa-times"></i>
        </button>
      </div>
      <div class="modal-body">
        ${content}
      </div>
    </div>
  `;
  document.body.appendChild(overlay);
  overlay.addEventListener('click', function(e) {
    if (e.target === overlay) {
      closeModal(overlay.querySelector('.modal-close'));
    }
  });
  document.body.style.overflow = 'hidden';
}

function closeModal(btn) {
  const overlay = btn.closest('.modal-overlay');
  if (overlay) {
    overlay.classList.remove('active');
    setTimeout(() => overlay.remove(), 300);
    document.body.style.overflow = '';
  }
}

function showNotification(message, type = 'info') {
  const notification = document.createElement('div');
  notification.className = `notification ${type}`;
  
  const icons = {
    success: 'fa-check-circle',
    error: 'fa-exclamation-circle',
    info: 'fa-info-circle'
  };
  
  notification.innerHTML = `
    <i class="fas ${icons[type] || icons.info}"></i>
    <span>${escapeHtml(message)}</span>
  `;
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.style.opacity = '0';
    notification.style.transform = 'translateX(100px)';
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

function animateCounter(element, target, duration = 2000) {
  const start = 0;
  const startTime = performance.now();
  
  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const easeProgress = 1 - Math.pow(1 - progress, 3);
    const current = Math.floor(start + (target - start) * easeProgress);
    
    element.textContent = current.toLocaleString();
    
    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }
  
  requestAnimationFrame(update);
}

function initCounters() {
  const counters = document.querySelectorAll('[data-counter]');
  counters.forEach(counter => {
    const target = parseInt(counter.dataset.counter);
    if (target) {
      animateCounter(counter, target);
    }
  });
}

const quizQuestions = {
  beginner: [
    {
      question: "CPU的中文名称是什么？",
      options: ["中央处理器", "图形处理器", "内存控制器", "硬盘驱动器"],
      correct: 0,
      explanation: "CPU（Central Processing Unit）即中央处理器，是计算机的核心部件，负责执行程序指令和处理数据。"
    },
    {
      question: "以下哪个是存储设备？",
      options: ["CPU", "GPU", "SSD", "RAM"],
      correct: 2,
      explanation: "SSD（固态硬盘）是一种存储设备，用于永久存储数据。RAM是内存，断电后数据会丢失。"
    },
    {
      question: "GPU主要用于什么？",
      options: ["文字处理", "图形渲染", "数据存储", "网络连接"],
      correct: 1,
      explanation: "GPU（Graphics Processing Unit）即图形处理器，主要用于图形渲染和并行计算任务。"
    },
    {
      question: "内存的主要作用是什么？",
      options: ["永久存储数据", "临时存储运行中的程序和数据", "显示图像", "连接网络"],
      correct: 1,
      explanation: "内存（RAM）用于临时存储正在运行的程序和数据，断电后数据会丢失。"
    },
    {
      question: "主板的作用是什么？",
      options: ["处理图形", "连接各个硬件组件", "存储数据", "提供电源"],
      correct: 1,
      explanation: "主板是计算机的主要电路板，用于连接CPU、内存、存储设备等各个硬件组件。"
    }
  ],
  intermediate: [
    {
      question: "以下哪个不是CPU的主要参数？",
      options: ["核心数", "主频", "显存", "缓存"],
      correct: 2,
      explanation: "显存是显卡的参数，不是CPU的参数。CPU的主要参数包括核心数、主频、缓存等。"
    },
    {
      question: "DDR5相比DDR4的主要优势是什么？",
      options: ["更小的体积", "更高的频率和带宽", "更低的价格", "更好的兼容性"],
      correct: 1,
      explanation: "DDR5内存相比DDR4具有更高的频率和带宽，能够提供更好的性能。"
    },
    {
      question: "NVMe SSD相比SATA SSD的优势是什么？",
      options: ["更大的容量", "更快的读写速度", "更低的价格", "更好的兼容性"],
      correct: 1,
      explanation: "NVMe SSD使用PCIe通道，读写速度远超SATA SSD，是目前最快的消费级存储方案。"
    },
    {
      question: "电源的80 PLUS认证表示什么？",
      options: ["功率大小", "转换效率等级", "品牌质量", "安全认证"],
      correct: 1,
      explanation: "80 PLUS认证表示电源的转换效率等级，等级越高（如金牌、白金牌），效率越高，越节能。"
    },
    {
      question: "以下哪种散热方式效果最好？",
      options: ["风冷散热", "一体式水冷", "分体式水冷", "被动散热"],
      correct: 2,
      explanation: "分体式水冷散热效果最好，但安装复杂，价格昂贵。一体式水冷是性能和便利性的平衡选择。"
    }
  ],
  advanced: [
    {
      question: "CPU的超线程技术是什么？",
      options: ["提高主频的技术", "让一个物理核心模拟两个逻辑核心", "增加缓存的技术", "降低功耗的技术"],
      correct: 1,
      explanation: "超线程技术（Hyper-Threading）让一个物理CPU核心可以同时处理两个线程，提高多任务处理能力。"
    },
    {
      question: "GPU的Tensor Core主要用于什么？",
      options: ["图形渲染", "AI计算", "视频编码", "物理模拟"],
      correct: 1,
      explanation: "Tensor Core是NVIDIA GPU中专门用于AI和深度学习计算的单元，可以大幅加速AI推理和训练。"
    },
    {
      question: "以下哪个不是主板芯片组的功能？",
      options: ["控制USB接口", "管理PCIe通道", "执行程序指令", "控制SATA接口"],
      correct: 2,
      explanation: "执行程序指令是CPU的功能，不是主板芯片组的功能。芯片组主要负责管理各种接口和总线。"
    },
    {
      question: "ECC内存主要用于什么场景？",
      options: ["游戏电脑", "工作站和服务器", "家用电脑", "笔记本电脑"],
      correct: 1,
      explanation: "ECC内存具有错误校验和纠正功能，主要用于需要高稳定性的工作站和服务器环境。"
    },
    {
      question: "PCIe 5.0相比PCIe 4.0的带宽提升是多少？",
      options: ["50%", "100%", "150%", "200%"],
      correct: 1,
      explanation: "PCIe 5.0的带宽是PCIe 4.0的两倍，即100%的提升。每通道带宽从2GB/s提升到4GB/s。"
    }
  ]
};

let currentQuiz = null;
let currentQuestionIndex = 0;
let correctAnswers = 0;

function startQuiz(level) {
  currentQuiz = quizQuestions[level];
  if (!currentQuiz) {
    showNotification('测验题目加载失败', 'error');
    return;
  }
  
  currentQuestionIndex = 0;
  correctAnswers = 0;
  
  showQuizModal();
}

function showQuizModal() {
  const question = currentQuiz[currentQuestionIndex];
  const total = currentQuiz.length;
  
  const content = `
    <div class="mb-6">
      <div class="flex justify-between items-center mb-4">
        <span class="text-sm text-[var(--text-secondary)]">题目 ${currentQuestionIndex + 1}/${total}</span>
        <span class="text-sm text-[var(--accent-cyan)]">正确: ${correctAnswers}</span>
      </div>
      <div class="h-2 bg-white/10 rounded-full overflow-hidden">
        <div class="h-full bg-gradient-to-r from-[var(--accent-cyan)] to-[var(--accent-blue)] transition-all" style="width: ${((currentQuestionIndex + 1) / total) * 100}%"></div>
      </div>
    </div>
    
    <h4 class="font-bold text-lg mb-6">${escapeHtml(question.question)}</h4>
    
    <div class="space-y-3" id="quizOptions">
      ${question.options.map((opt, i) => `
        <div class="quiz-option" data-index="${i}" onclick="selectQuizOption(${i})">
          <div class="quiz-option-letter">${String.fromCharCode(65 + i)}</div>
          <span>${escapeHtml(opt)}</span>
        </div>
      `).join('')}
    </div>
    
    <div id="quizExplanation" class="mt-6 hidden">
      <div class="highlight-box">
        <div class="font-bold mb-2"><i class="fas fa-lightbulb text-[var(--accent-yellow)] mr-2"></i>解析</div>
        <p class="text-sm text-[var(--text-secondary)]">${escapeHtml(question.explanation)}</p>
      </div>
    </div>
    
    <div class="mt-6 flex justify-end">
      <button id="nextQuestionBtn" class="btn-primary hidden" onclick="nextQuizQuestion()">
        ${currentQuestionIndex < total - 1 ? '下一题' : '查看结果'} <i class="fas fa-arrow-right ml-2"></i>
      </button>
    </div>
  `;
  
  showModal(`硬件知识测验`, content);
}

function selectQuizOption(index) {
  const question = currentQuiz[currentQuestionIndex];
  const options = document.querySelectorAll('.quiz-option');
  const explanation = document.getElementById('quizExplanation');
  const nextBtn = document.getElementById('nextQuestionBtn');
  
  options.forEach((opt, i) => {
    opt.onclick = null;
    if (i === question.correct) {
      opt.classList.add('correct');
    } else if (i === index && i !== question.correct) {
      opt.classList.add('incorrect');
    }
  });
  
  if (index === question.correct) {
    correctAnswers++;
    showNotification('回答正确！', 'success');
  } else {
    showNotification('回答错误', 'error');
  }
  
  explanation.classList.remove('hidden');
  nextBtn.classList.remove('hidden');
}

function nextQuizQuestion() {
  currentQuestionIndex++;
  
  if (currentQuestionIndex >= currentQuiz.length) {
    showQuizResult();
  } else {
    closeModal(document.querySelector('.modal-close'));
    setTimeout(showQuizModal, 300);
  }
}

function showQuizResult() {
  const total = currentQuiz.length;
  const percentage = Math.round((correctAnswers / total) * 100);
  
  let message, icon, color;
  if (percentage >= 80) {
    message = '太棒了！你是硬件达人！';
    icon = 'fa-trophy';
    color = 'var(--accent-green)';
  } else if (percentage >= 60) {
    message = '不错！继续加油！';
    icon = 'fa-thumbs-up';
    color = 'var(--accent-cyan)';
  } else {
    message = '还需努力，多学习吧！';
    icon = 'fa-book';
    color = 'var(--accent-orange)';
  }
  
  const content = `
    <div class="text-center py-8">
      <div class="w-24 h-24 rounded-full mx-auto mb-6 flex items-center justify-center" style="background: linear-gradient(135deg, ${color}20, ${color}40)">
        <i class="fas ${icon} text-4xl" style="color: ${color}"></i>
      </div>
      
      <h4 class="font-bold text-2xl mb-2">${message}</h4>
      <p class="text-[var(--text-secondary)] mb-8">你答对了 ${correctAnswers}/${total} 道题目</p>
      
      <div class="flex justify-center gap-4">
        <button class="btn-secondary" onclick="closeModal(this)">
          <i class="fas fa-times"></i> 关闭
        </button>
        <button class="btn-primary" onclick="closeModal(this); setTimeout(() => startQuiz('${currentQuiz === quizQuestions.beginner ? 'beginner' : currentQuiz === quizQuestions.intermediate ? 'intermediate' : 'advanced'}'), 300)">
          <i class="fas fa-redo"></i> 再试一次
        </button>
      </div>
    </div>
  `;
  
  closeModal(document.querySelector('.modal-close'));
  setTimeout(() => showModal('测验结果', content), 300);
}

const hardwareData = {
  cpu: {
    title: 'CPU处理器',
    icon: 'fa-microchip',
    color: 'var(--accent-cyan)',
    description: 'CPU（中央处理器）是计算机的核心部件，负责执行程序指令和处理数据。',
    specs: [
      { label: '核心数', desc: '决定多任务处理能力' },
      { label: '线程数', desc: '影响并行处理效率' },
      { label: '主频', desc: '影响单核性能' },
      { label: '缓存', desc: '加速数据访问' },
      { label: '制程', desc: '影响功耗和发热' },
      { label: 'TDP', desc: '热设计功耗' }
    ],
    brands: ['Intel', 'AMD'],
    tips: '选择CPU时需考虑用途：办公选i3/R3，游戏选i5/R5，专业工作选i7/R7或i9/R9'
  },
  gpu: {
    title: '显卡GPU',
    icon: 'fa-gamepad',
    color: 'var(--accent-orange)',
    description: 'GPU（图形处理器）专门用于图形渲染和并行计算，是游戏和创作的重要硬件。',
    specs: [
      { label: '显存', desc: '影响高分辨率游戏性能' },
      { label: '核心频率', desc: '影响渲染速度' },
      { label: 'CUDA/流处理器', desc: '影响并行计算能力' },
      { label: '显存位宽', desc: '影响显存带宽' },
      { label: '散热设计', desc: '影响温度和噪音' },
      { label: '功耗', desc: '影响电源选择' }
    ],
    brands: ['NVIDIA', 'AMD', 'Intel'],
    tips: '游戏玩家建议选择RTX 40系列或RX 7000系列，创作者可考虑专业显卡'
  },
  ram: {
    title: '内存RAM',
    icon: 'fa-memory',
    color: 'var(--accent-green)',
    description: '内存用于临时存储运行中的程序和数据，影响系统响应速度和多任务能力。',
    specs: [
      { label: '容量', desc: '影响可运行程序数量' },
      { label: '频率', desc: '影响数据传输速度' },
      { label: '时序', desc: '影响延迟' },
      { label: '通道', desc: '双通道可提升带宽' },
      { label: '类型', desc: 'DDR4/DDR5' },
      { label: '散热', desc: '影响稳定性' }
    ],
    brands: ['金士顿', '芝奇', '海盗船', '威刚'],
    tips: '办公推荐16GB，游戏推荐32GB，专业工作推荐64GB或更多'
  },
  ssd: {
    title: '固态硬盘',
    icon: 'fa-hdd',
    color: 'var(--accent-pink)',
    description: 'SSD使用闪存存储数据，读写速度远超传统机械硬盘，是现代电脑的标配。',
    specs: [
      { label: '容量', desc: '决定可存储数据量' },
      { label: '接口', desc: 'SATA/NVMe' },
      { label: '协议', desc: 'PCIe 3.0/4.0/5.0' },
      { label: '读写速度', desc: '影响系统响应' },
      { label: '缓存', desc: '影响随机性能' },
      { label: '寿命', desc: 'TBW写入寿命' }
    ],
    brands: ['三星', '西部数据', '美光', '金士顿'],
    tips: '系统盘推荐NVMe SSD，容量至少500GB，重要数据建议定期备份'
  },
  motherboard: {
    title: '主板',
    icon: 'fa-th',
    color: 'var(--accent-yellow)',
    description: '主板是连接所有硬件的核心电路板，决定了电脑的扩展能力和稳定性。',
    specs: [
      { label: '芯片组', desc: '决定功能和扩展性' },
      { label: '板型', desc: 'ATX/mATX/ITX' },
      { label: '插槽', desc: 'CPU/内存/PCIe插槽' },
      { label: '接口', desc: 'USB/SATA/M.2' },
      { label: '供电', desc: '影响CPU超频' },
      { label: '网卡', desc: '有线/无线网卡' }
    ],
    brands: ['华硕', '微星', '技嘉', '华擎'],
    tips: '选择主板需注意与CPU的兼容性，Intel和AMD使用不同接口'
  },
  psu: {
    title: '电源',
    icon: 'fa-bolt',
    color: 'var(--accent-orange)',
    description: '电源为所有硬件提供稳定的电力供应，是电脑稳定运行的基础保障。',
    specs: [
      { label: '功率', desc: '需满足硬件需求' },
      { label: '认证', desc: '80 PLUS效率等级' },
      { label: '模组', desc: '全模组/半模组/非模组' },
      { label: '接口', desc: 'CPU/GPU供电接口' },
      { label: '风扇', desc: '散热和静音' },
      { label: '保护', desc: '过压/过流保护' }
    ],
    brands: ['海韵', '美商海盗船', '安钛克', '振华'],
    tips: '电源功率建议留有余量，推荐选择80 PLUS金牌以上认证产品'
  }
};

function showHardwareModal(hardwareType) {
  const data = hardwareData[hardwareType];
  if (!data) {
    showNotification('硬件信息加载失败', 'error');
    return;
  }
  
  const content = `
    <div class="mb-6">
      <p class="text-[var(--text-secondary)]">${escapeHtml(data.description)}</p>
    </div>
    
    <div class="mb-6">
      <h4 class="font-bold mb-4 flex items-center gap-2">
        <i class="fas fa-list-ul" style="color: ${data.color}"></i>
        主要参数
      </h4>
      <div class="grid grid-cols-2 gap-3">
        ${data.specs.map(spec => `
          <div class="p-3 rounded-xl bg-white/5">
            <div class="font-bold text-sm">${escapeHtml(spec.label)}</div>
            <div class="text-xs text-[var(--text-secondary)]">${escapeHtml(spec.desc)}</div>
          </div>
        `).join('')}
      </div>
    </div>
    
    <div class="mb-6">
      <h4 class="font-bold mb-4 flex items-center gap-2">
        <i class="fas fa-building" style="color: ${data.color}"></i>
        主要品牌
      </h4>
      <div class="flex flex-wrap gap-2">
        ${data.brands.map(brand => `
          <span class="tag tag-cyan">${escapeHtml(brand)}</span>
        `).join('')}
      </div>
    </div>
    
    <div class="highlight-box">
      <div class="font-bold mb-2"><i class="fas fa-lightbulb text-[var(--accent-yellow)] mr-2"></i>选购建议</div>
      <p class="text-sm text-[var(--text-secondary)]">${escapeHtml(data.tips)}</p>
    </div>
  `;
  
  showModal(data.title, content);
}

document.addEventListener('DOMContentLoaded', function() {
  initCounters();
  
  const learnerCount = document.getElementById('learnerCount');
  if (learnerCount) {
    animateCounter(learnerCount, 12847, 2000);
  }
  
  initEnhancedFeatures();
});

function initEnhancedFeatures() {
  console.log('[增强功能] 初始化增强特性');
}
