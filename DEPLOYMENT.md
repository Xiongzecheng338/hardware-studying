# GitHub 部署指南

本指南将帮助您将"硬件探索者"项目部署到 GitHub Pages，使网站可以通过互联网访问。

## 📋 部署前检查清单

### ✅ 代码质量检查

- [x] 无 JavaScript 语法错误
- [x] 无 CSS 语法错误
- [x] HTML 结构完整
- [x] 所有文件路径正确
- [x] 响应式设计正常

### ✅ 功能完整性

- [x] 所有页面可正常访问
- [x] 导航功能正常
- [x] 交互功能正常
- [x] 动画效果正常
- [x] 图表显示正常

### ✅ 文档完整性

- [x] README.md 完整
- [x] LICENSE 文件存在
- [x] .gitignore 配置正确
- [x] 部署配置文件就绪

## 🚀 部署步骤

### 方法一：使用 GitHub Actions（推荐）

#### 步骤 1：创建 GitHub 仓库

1. 访问 [GitHub](https://github.com)
2. 点击右上角 "+" → "New repository"
3. 填写仓库信息：
   - Repository name: `hardware-studying`
   - Description: "硬件探索者 - 一站式硬件知识学习平台"
   - 选择 **Public**
   - **不要** 勾选 "Initialize this repository with a README"
4. 点击 "Create repository"

#### 步骤 2：推送代码到 GitHub

打开终端（PowerShell），执行以下命令：

```bash
# 进入项目目录
cd c:\Users\X1882\Desktop\ppp\hardware-studying

# 初始化 Git 仓库
git init

# 添加所有文件
git add .

# 提交
git commit -m "Initial commit: 硬件探索者项目"

# 添加远程仓库（替换为你的 GitHub 用户名）
git remote add origin https://github.com/X1882/hardware-studying.git

# 推送到 GitHub
git branch -M main
git push -u origin main
```

#### 步骤 3：启用 GitHub Actions

1. 进入刚创建的仓库页面
2. 点击 "Actions" 标签
3. 如果是首次使用，点击 "I understand my workflows, go ahead and enable them"
4. 等待部署工作流完成（约 2-3 分钟）

#### 步骤 4：配置 GitHub Pages

1. 进入仓库 "Settings" → "Pages"
2. 在 "Build and deployment" 部分：
   - Source: 选择 "GitHub Actions"
3. 页面会自动配置

#### 步骤 5：访问网站

部署完成后，您的网站将可通过以下地址访问：
```
https://X1882.github.io/hardware-studying/
```

### 方法二：手动部署（备用方案）

#### 步骤 1：创建仓库

同上（方法一的步骤 1）

#### 步骤 2：推送代码

```bash
cd c:\Users\X1882\Desktop\ppp\hardware-studying
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/X1882/hardware-studying.git
git branch -M main
git push -u origin main
```

#### 步骤 3：配置 GitHub Pages

1. 进入仓库 "Settings" → "Pages"
2. 在 "Build and deployment" 部分：
   - Source: 选择 "Deploy from a branch"
   - Branch: 选择 "main" 和 "/ (root)"
3. 点击 "Save"

#### 步骤 4：等待部署完成

等待 1-2 分钟，刷新页面即可看到部署成功的消息和网站链接。

## 🔍 验证部署

### 检查清单

访问部署后的网站，检查以下内容：

- [ ] 首页正常加载
- [ ] 所有导航链接有效
- [ ] CSS 样式正确显示
- [ ] JavaScript 功能正常
- [ ] 动画效果流畅
- [ ] 图片正常显示
- [ ] 移动端响应式正常

### 性能测试

使用以下工具测试网站性能：

1. **Google PageSpeed Insights**
   - 访问：https://pagespeed.web.dev/
   - 输入你的网站 URL
   - 查看性能评分和建议

2. **GTmetrix**
   - 访问：https://gtmetrix.com/
   - 输入你的网站 URL
   - 查看加载时间和优化建议

3. **WebPageTest**
   - 访问：https://www.webpagetest.org/
   - 输入你的网站 URL
   - 查看详细的性能指标

## 🔧 更新部署

### 自动部署（GitHub Actions）

每次推送到 `main` 分支时，GitHub Actions 会自动部署：

```bash
# 修改代码后
git add .
git commit -m "更新内容说明"
git push origin main
```

等待 2-3 分钟，更新会自动部署到 GitHub Pages。

### 手动部署

如果使用了手动部署方式：

1. 推送代码（同上）
2. GitHub Pages 会自动检测更改并重新部署
3. 等待 1-2 分钟即可

## ⚠️ 常见问题

### 1. 部署后页面显示 404

**原因**：GitHub Pages 还未完成部署

**解决方案**：
- 等待 2-3 分钟后刷新
- 检查 Actions 标签页查看部署状态
- 确认部署工作流成功完成

### 2. 样式/脚本文件加载失败

**原因**：文件路径问题

**解决方案**：
- 检查 HTML 中的 CSS/JS 引用路径
- 确保使用相对路径（如 `src/css/style.css`）
- 不要使用绝对路径（如 `/src/css/style.css`）

### 3. 图片不显示

**原因**：图片路径错误或未推送图片文件

**解决方案**：
- 检查图片文件是否存在
- 确认图片路径正确
- 使用相对路径引用图片
- 检查文件大小（GitHub 有 100MB 单文件限制）

### 4. 自定义域名配置

如果想使用自己的域名：

1. 进入 Settings → Pages
2. 在 "Custom domain" 输入你的域名
3. 点击 "Save"
4. 在域名提供商处配置 CNAME 记录

### 5. 部署失败

**查看错误日志**：
1. 进入 Actions 标签页
2. 点击失败的部署工作流
3. 查看详细错误信息

**常见解决方法**：
- 检查 .gitignore 是否误删重要文件
- 确认所有文件路径正确
- 重新推送代码

## 📊 性能优化建议

### 1. 资源加载优化

已实现的优化：
- ✅ CDN 加速（TailwindCSS、Font Awesome）
- ✅ 资源预连接（preconnect、dns-prefetch）
- ✅ 脚本延迟加载（defer）

### 2. 图片优化

建议：
- 使用 WebP 格式（支持 fallback）
- 压缩图片文件
- 使用适当的图片尺寸

### 3. 代码优化

已实现的优化：
- ✅ CSS 文件分离（style.css + enhanced.css）
- ✅ JS 模块化（script.js + enhancements.js + core-enhanced.js）
- ✅ 数据分离（JSON 数据文件）

### 4. 缓存策略

浏览器会自动缓存：
- 静态资源（CSS、JS）
- 图片文件
- 字体文件

## 🎉 部署成功标志

部署成功后，您将看到：

1. ✅ GitHub Actions 显示绿色勾
2. ✅ Pages Settings 显示 "Your site is live"
3. ✅ 访问网站 URL 正常显示
4. ✅ 所有功能正常运行

## 📞 获取帮助

如果遇到问题：

1. **查看 GitHub Status**
   - https://www.githubstatus.com/
   - 检查 GitHub 服务状态

2. **查看 GitHub Pages 文档**
   - https://docs.github.com/en/pages

3. **提交 Issue**
   - https://github.com/X1882/hardware-studying/issues

## 🔗 相关资源

- [GitHub Pages 官方文档](https://docs.github.com/en/pages)
- [GitHub Actions 文档](https://docs.github.com/en/actions)
- [Pagespeed Insights](https://pagespeed.web.dev/)
- [Web 性能优化最佳实践](https://web.dev/performance/)

---

<div align="center">

**祝您部署成功！🎊**

如有问题，请查看 [GitHub Pages 文档](https://docs.github.com/en/pages) 或提交 Issue。

</div>
