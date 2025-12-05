# PPT 演示应用

一个基于 React + TypeScript + Vite 构建的交互式演示文稿应用。

## 功能特性

- 📊 多种幻灯片布局（标题页、两列、三列、分割布局等）
- 🎨 可编辑的文本内容
- 🖼️ 图片上传和展示
- 🎯 拖拽调整组件位置和大小
- ➕ 添加自定义文本和图片组件
- 🗑️ 删除组件
- ↩️ 撤销/重做功能
- 📋 幻灯片概览和拖拽排序
- ⌨️ 键盘快捷键支持

## 技术栈

- React 19
- TypeScript
- Vite
- Tailwind CSS
- Lucide React (图标)

## 本地开发

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm run dev
```

应用将在 http://localhost:3000 启动

### 构建生产版本

```bash
npm run build
```

### 预览生产版本

```bash
npm run preview
```

## 部署到 Vercel

1. 将代码推送到 GitHub
2. 在 [Vercel](https://vercel.com) 导入 GitHub 仓库
3. Vercel 会自动检测 Vite 项目并配置构建设置
4. 点击部署即可

## 使用说明

### 快捷键

- `→` 或 `Space`: 下一张幻灯片
- `←`: 上一张幻灯片
- `Ctrl+Z`: 撤销
- `Ctrl+Y` 或 `Ctrl+Shift+Z`: 重做

### 编辑功能

- 点击文本内容即可编辑
- 鼠标悬停在组件上可看到拖拽和调整大小手柄
- 按住 Shift 键调整大小时可保持宽高比
- 在概览模式下可拖拽幻灯片重新排序
