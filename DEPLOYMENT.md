# 硬件探索者网站部署说明

## 项目结构

```
硬件探索者/
├── index.html              # 首页
├── learning-path.html      # 学习路径页面
├── beginner-guide.html     # 新手入门页面
├── encyclopedia.html       # 硬件百科页面
├── mobile-hardware.html    # 手机硬件页面
├── other-devices.html      # 其他设备页面
├── builder.html            # 装机模拟页面
├── quiz.html               # 知识测验页面
├── achievements.html       # 成就系统页面
├── login.html              # 登录页面
├── src/
│   ├── css/
│   │   └── style.css       # 样式文件
│   ├── js/
│   │   └── script.js       # JavaScript文件
│   └── assets/             # 资源文件目录
├── netlify.toml            # Netlify部署配置
└── DEPLOYMENT.md           # 部署说明文档
```

## 部署方法

### 1. 本地测试

在本地运行网站进行测试：

```bash
# 方法1：使用Python内置服务器
python -m http.server 8000

# 方法2：使用Node.js的http-server
npm install -g http-server
http-server -p 8000
```

然后在浏览器中访问 `http://localhost:8000` 查看网站。

### 2. 部署到Netlify

1. **创建GitHub仓库**
   - 将项目文件推送到GitHub仓库

2. **部署到Netlify**
   - 登录Netlify账号
   - 点击"New site from Git"
   - 选择你的GitHub仓库
   - 配置构建设置：
     - Build command: `npm run build` (如果没有package.json，可留空)
     - Publish directory: `/` (根目录)
   - 点击"Deploy site"

3. **配置域名** (可选)
   - 在Netlify中设置自定义域名
   - 配置DNS记录指向Netlify提供的域名

## 主要功能

1. **学习路径**：系统化的学习路线，从零基础到硬件专家
2. **硬件百科**：详细的硬件组件介绍和选购指南
3. **装机模拟**：通过拖放方式组装虚拟电脑
4. **知识测验**：检验学习成果的问答系统
5. **成就系统**：通过完成任务获得成就和等级提升
6. **用户登录**：用户身份验证和状态管理
7. **响应式设计**：适配不同屏幕尺寸的设备

## 技术栈

- HTML5
- CSS3 (Tailwind CSS)
- JavaScript
- Font Awesome 图标
- 响应式设计

## 注意事项

1. **性能优化**：图片和资源文件应适当压缩，以提高加载速度
2. **SEO优化**：每个页面应设置合适的标题和描述
3. **安全性**：确保用户输入得到适当验证，防止XSS攻击
4. **兼容性**：测试网站在不同浏览器中的表现

## 维护建议

1. **定期更新**：及时更新内容和功能，保持网站活力
2. **备份数据**：定期备份网站文件和用户数据
3. **监控性能**：使用工具监控网站性能和用户体验
4. **收集反馈**：通过评论系统收集用户反馈，持续改进

## 联系信息

如有问题或建议，请联系网站管理员。

---

**硬件探索者** - 综合硬件知识学习平台
