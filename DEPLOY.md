# 部署指南

## 步骤 1: 在 GitHub 上创建仓库

1. 登录 [GitHub](https://github.com)
2. 点击右上角的 `+` 号，选择 `New repository`
3. 填写仓库信息：
   - Repository name: `ppt-demo` (或您喜欢的名称)
   - Description: `交互式演示文稿应用`
   - 选择 Public 或 Private
   - **不要**勾选 "Initialize this repository with a README"（因为我们已经有了）
4. 点击 `Create repository`

## 步骤 2: 推送代码到 GitHub

在终端中执行以下命令（将 `YOUR_USERNAME` 替换为您的 GitHub 用户名，`REPO_NAME` 替换为仓库名）：

```bash
# 添加远程仓库
git remote add origin https://github.com/YOUR_USERNAME/REPO_NAME.git

# 推送代码
git branch -M main
git push -u origin main
```

或者如果您使用 SSH：

```bash
git remote add origin git@github.com:YOUR_USERNAME/REPO_NAME.git
git branch -M main
git push -u origin main
```

## 步骤 3: 在 Vercel 上部署

1. 访问 [Vercel](https://vercel.com)
2. 使用 GitHub 账号登录
3. 点击 `Add New...` → `Project`
4. 导入您的 GitHub 仓库
5. Vercel 会自动检测到这是一个 Vite 项目，配置如下：
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`
6. 点击 `Deploy` 开始部署
7. 等待部署完成，Vercel 会提供一个部署 URL（例如：`https://ppt-demo.vercel.app`）

## 自动部署

部署完成后，每次您推送代码到 GitHub 的 main 分支，Vercel 会自动重新部署您的应用。

## 环境变量（如果需要）

如果将来需要添加环境变量（如 API keys），可以在 Vercel 项目设置中添加：
1. 进入项目设置 → Environment Variables
2. 添加变量名称和值
3. 重新部署

## 自定义域名（可选）

1. 在 Vercel 项目设置中，进入 `Domains`
2. 添加您的自定义域名
3. 按照提示配置 DNS 记录


