function navigateTo(pageName) {
  window.location.href = `${pageName}.html`;
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
  initLogin();
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
  
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  
  const particles = [];
  const particleCount = 80;
  
  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 2 + 1,
      speedX: Math.random() * 0.5 - 0.25,
      speedY: Math.random() * 0.5 - 0.25,
      color: `rgba(0, 229, 204, ${Math.random() * 0.5 + 0.1})`
    });
  }
  
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
      
      p.x += p.speedX;
      p.y += p.speedY;
      
      if (p.x < 0 || p.x > canvas.width) p.speedX *= -1;
      if (p.y < 0 || p.y > canvas.height) p.speedY *= -1;
    }
    
    requestAnimationFrame(animate);
  }
  
  animate();
  
  window.addEventListener('resize', function() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
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

function initLogin() {
  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const username = document.getElementById('username').value;
      const password = document.getElementById('password').value;
      const remember = document.getElementById('remember').checked;
      
      console.log('Login attempt:', { username, password, remember });
      
      localStorage.setItem('user', JSON.stringify({ username, loggedIn: true }));
      alert('登录成功！');
      navigateTo('index');
    });
  }
  
  checkLoginStatus();
}

function checkLoginStatus() {
  const user = localStorage.getItem('user');
  if (user) {
    const userObj = JSON.parse(user);
    if (userObj.loggedIn) {
      console.log('User logged in:', userObj.username);
    }
  }
}

function logout() {
  localStorage.removeItem('user');
  alert('已登出');
  navigateTo('login');
}

function initComments() {
  const commentForms = document.querySelectorAll('.comment-form');
  commentForms.forEach(form => {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      const commentText = this.querySelector('.comment-input').value;
      
      const user = localStorage.getItem('user');
      if (!user) {
        alert('请先登录后再评论');
        navigateTo('login');
        return;
      }
      
      const userObj = JSON.parse(user);
      
      console.log('Comment submitted:', { user: userObj.username, content: commentText });
      
      addComment(userObj.username, commentText);
      
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
      
      const user = localStorage.getItem('user');
      if (!user) {
        alert('请先登录后再回复');
        navigateTo('login');
        return;
      }
      
      const userObj = JSON.parse(user);
      
      console.log('Reply submitted:', { user: userObj.username, content: replyText, parent: parentAuthor });
      
      addReply(commentItem, userObj.username, replyText);
      
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
  
  const commentElement = document.createElement('div');
  commentElement.className = 'comment-item';
  commentElement.innerHTML = `
    <div class="comment-header">
      <span class="comment-author"><i class="fas fa-user-circle"></i> ${author}</span>
      <span class="comment-time">${new Date().toLocaleString()}</span>
    </div>
    <div class="comment-content">${content}</div>
    <div class="comment-buttons">
      <button class="comment-button reply"><i class="fas fa-reply"></i> 回复</button>
      <button class="comment-button delete"><i class="fas fa-trash-alt"></i> 删除</button>
    </div>
    <div class="comment-reply-form">
      <textarea class="reply-input" placeholder="写下你的回复..."></textarea>
      <div class="reply-actions">
        <button type="button" class="btn-secondary" onclick="this.closest('.comment-reply-form').classList.remove('active')">取消</button>
        <button type="submit" class="btn-primary">回复</button>
      </div>
    </div>
    <div class="comment-replies"></div>
  `;
  
  commentsList.appendChild(commentElement);
  
  initComments();
}

function addReply(commentItem, author, content) {
  const repliesContainer = commentItem.querySelector('.comment-replies');
  if (!repliesContainer) return;
  
  const replyElement = document.createElement('div');
  replyElement.className = 'comment-item';
  replyElement.innerHTML = `
    <div class="comment-header">
      <span class="comment-author"><i class="fas fa-user-circle"></i> ${author}</span>
      <span class="comment-time">${new Date().toLocaleString()}</span>
    </div>
    <div class="comment-content">${content}</div>
    <div class="comment-buttons">
      <button class="comment-button delete"><i class="fas fa-trash-alt"></i> 删除</button>
    </div>
  `;
  
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
