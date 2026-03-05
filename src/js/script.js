// 导航功能
function navigateTo(pageName) {
  window.location.href = `${pageName}.html`;
}

// 初始化导航状态
function initNavigation() {
  // 获取当前页面名称
  const currentPage = window.location.pathname.split('/').pop().replace('.html', '');
  const pageName = currentPage || 'index';
  
  // 更新侧边栏导航状态
  const navItems = document.querySelectorAll('.nav-item');
  navItems.forEach(item => {
    const pageId = item.dataset.page;
    if (pageId === pageName) {
      item.classList.add('active');
    }
  });
  
  // 更新移动端导航状态
  const mobileNavItems = document.querySelectorAll('.mobile-nav > div');
  mobileNavItems.forEach(item => {
    const pageId = item.dataset.mobile;
    if (pageId === pageName) {
      item.classList.add('active');
    }
  });
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
  // 初始化导航状态
  initNavigation();
  
  // 初始化粒子效果
  initParticles();
  
  // 初始化学习进度
  updateProgress();
  
  // 初始化登录功能
  initLogin();
  
  // 初始化评论系统
  initComments();
  
  // 硬件百科过滤功能
  const filterTags = document.querySelectorAll('.filter-tag');
  const hardwareCards = document.querySelectorAll('.hardware-card');
  
  if (filterTags.length > 0) {
    filterTags.forEach(tag => {
      tag.addEventListener('click', function() {
        // 更新标签状态
        filterTags.forEach(t => t.classList.remove('active', 'bg-[var(--accent-cyan)]/20', 'text-[var(--accent-cyan)]', 'border-[var(--accent-cyan)]/30'));
        filterTags.forEach(t => t.classList.add('bg-white/5', 'text-[var(--text-secondary)]', 'border-white/10'));
        this.classList.add('active', 'bg-[var(--accent-cyan)]/20', 'text-[var(--accent-cyan)]', 'border-[var(--accent-cyan)]/30');
        this.classList.remove('bg-white/5', 'text-[var(--text-secondary)]', 'border-white/10');
        
        const filter = this.dataset.filter;
        
        // 过滤硬件卡片
        hardwareCards.forEach(card => {
          if (filter === 'all' || card.dataset.category === filter) {
            card.style.display = 'block';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
    
    // 硬件卡片点击事件
    hardwareCards.forEach(card => {
      card.addEventListener('click', function() {
        const hardwareType = this.dataset.hardware;
        showHardwareModal(hardwareType);
      });
    });
  }
});

// 粒子效果
function initParticles() {
  const canvas = document.getElementById('particles');
  const ctx = canvas.getContext('2d');
  
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  
  const particles = [];
  const particleCount = 100;
  
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

// 硬件模态框
function showHardwareModal(hardwareType) {
  // 这里可以实现硬件详情模态框
  console.log('Showing modal for:', hardwareType);
  // 实际项目中，这里应该显示对应的硬件详细信息
}

// 更新学习进度
function updateProgress() {
  const progress = 0; // 实际项目中应该从本地存储或服务器获取
  document.getElementById('progressBar').style.width = `${progress}%`;
  document.getElementById('progressText').textContent = `${progress}%`;
}

// 登录功能
function initLogin() {
  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const username = document.getElementById('username').value;
      const password = document.getElementById('password').value;
      const remember = document.getElementById('remember').checked;
      
      // 模拟登录验证
      console.log('Login attempt:', { username, password, remember });
      
      // 实际项目中应该发送到服务器验证
      // 这里只是模拟登录成功
      localStorage.setItem('user', JSON.stringify({ username, loggedIn: true }));
      alert('登录成功！');
      // 跳转到首页
      navigateTo('home');
    });
  }
  
  // 检查登录状态
  checkLoginStatus();
}

// 检查登录状态
function checkLoginStatus() {
  const user = localStorage.getItem('user');
  if (user) {
    const userObj = JSON.parse(user);
    if (userObj.loggedIn) {
      // 更新导航栏显示登录状态
      console.log('User logged in:', userObj.username);
      // 实际项目中应该更新UI显示登录状态
    }
  }
}

// 登出功能
function logout() {
  localStorage.removeItem('user');
  alert('已登出');
  // 跳转到登录页面
  navigateTo('login');
}

// 评论系统
function initComments() {
  const commentForms = document.querySelectorAll('.comment-form');
  commentForms.forEach(form => {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      const commentText = this.querySelector('.comment-input').value;
      
      // 检查登录状态
      const user = localStorage.getItem('user');
      if (!user) {
        alert('请先登录后再评论');
        navigateTo('login');
        return;
      }
      
      const userObj = JSON.parse(user);
      
      // 模拟评论提交
      console.log('Comment submitted:', { user: userObj.username, content: commentText });
      
      // 实际项目中应该发送到服务器
      // 这里只是模拟添加评论
      addComment(userObj.username, commentText);
      
      // 清空输入框
      this.querySelector('.comment-input').value = '';
    });
  });
  
  // 回复按钮点击事件
  document.querySelectorAll('.comment-button.reply').forEach(button => {
    button.addEventListener('click', function() {
      const commentItem = this.closest('.comment-item');
      const replyForm = commentItem.querySelector('.comment-reply-form');
      replyForm.classList.toggle('active');
    });
  });
  
  // 回复表单提交
  document.querySelectorAll('.comment-reply-form').forEach(form => {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      const replyText = this.querySelector('.reply-input').value;
      const commentItem = this.closest('.comment-item');
      const parentAuthor = commentItem.querySelector('.comment-author').textContent;
      
      // 检查登录状态
      const user = localStorage.getItem('user');
      if (!user) {
        alert('请先登录后再回复');
        navigateTo('login');
        return;
      }
      
      const userObj = JSON.parse(user);
      
      // 模拟回复提交
      console.log('Reply submitted:', { user: userObj.username, content: replyText, parent: parentAuthor });
      
      // 实际项目中应该发送到服务器
      // 这里只是模拟添加回复
      addReply(commentItem, userObj.username, replyText);
      
      // 清空输入框并隐藏表单
      this.querySelector('.reply-input').value = '';
      this.classList.remove('active');
    });
  });
  
  // 删除评论按钮点击事件
  document.querySelectorAll('.comment-button.delete').forEach(button => {
    button.addEventListener('click', function() {
      if (confirm('确定要删除这条评论吗？')) {
        const commentItem = this.closest('.comment-item');
        commentItem.remove();
      }
    });
  });
}

// 添加评论
function addComment(author, content) {
  const commentsList = document.querySelector('.comments-list');
  if (!commentsList) return;
  
  const commentElement = document.createElement('div');
  commentElement.className = 'comment-item';
  commentElement.innerHTML = `
    <div class="comment-header">
      <span class="comment-author">${author}</span>
      <span class="comment-time">${new Date().toLocaleString()}</span>
    </div>
    <div class="comment-content">${content}</div>
    <div class="comment-buttons">
      <button class="comment-button reply">回复</button>
      <button class="comment-button delete">删除</button>
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
  
  // 重新绑定事件
  initComments();
}

// 添加回复
function addReply(commentItem, author, content) {
  const repliesContainer = commentItem.querySelector('.comment-replies');
  if (!repliesContainer) return;
  
  const replyElement = document.createElement('div');
  replyElement.className = 'comment-item';
  replyElement.innerHTML = `
    <div class="comment-header">
      <span class="comment-author">${author}</span>
      <span class="comment-time">${new Date().toLocaleString()}</span>
    </div>
    <div class="comment-content">${content}</div>
    <div class="comment-buttons">
      <button class="comment-button delete">删除</button>
    </div>
  `;
  
  repliesContainer.appendChild(replyElement);
  
  // 重新绑定事件
  initComments();
}

// 设备标签切换
function switchDeviceTab(tabId) {
  // 这里可以实现设备标签切换功能
  console.log('Switching to device tab:', tabId);
  // 实际项目中应该显示对应的设备内容
}

// 装机模拟器功能
function initBuilder() {
  // 这里可以实现装机模拟器的拖放功能
  console.log('Initializing builder');
  // 实际项目中应该实现拖放逻辑
}

// 知识测验功能
function initQuiz() {
  // 这里可以实现知识测验功能
  console.log('Initializing quiz');
  // 实际项目中应该实现测验逻辑
}

// 性能对比功能
function initCompare() {
  // 这里可以实现性能对比功能
  console.log('Initializing compare');
  // 实际项目中应该实现对比逻辑
}

// 硬件计算器功能
function initCalculator() {
  // 这里可以实现硬件计算器功能
  console.log('Initializing calculator');
  // 实际项目中应该实现计算逻辑
}

// 配置推荐功能
function initBuilds() {
  // 这里可以实现配置推荐功能
  console.log('Initializing builds');
  // 实际项目中应该实现推荐逻辑
}

// 故障排查功能
function initTroubleshoot() {
  // 这里可以实现故障排查功能
  console.log('Initializing troubleshoot');
  // 实际项目中应该实现排查逻辑
}

// 成就系统功能
function initAchievements() {
  // 这里可以实现成就系统功能
  console.log('Initializing achievements');
  // 实际项目中应该实现成就逻辑
}