# 同济高程课程网站

[![CC BY-NC-SA 4.0][cc-by-nc-sa-shield]][cc-by-nc-sa]

[cc-by-nc-sa]: http://creativecommons.org/licenses/by-nc-sa/4.0/
[cc-by-nc-sa-shield]: https://img.shields.io/badge/License-CC%20BY--NC--SA%204.0-lightgrey.svg

[![Deploy VitePress site to Pages](https://github.com/Tongji-High-level-Language-Programming/Website/actions/workflows/deploy.yml/badge.svg?branch=main)](https://github.com/Tongji-High-level-Language-Programming/Website/actions/workflows/deploy.yml)

## 简介

本项目为同济大学“高级语言程序设计”课程的课程网站，旨在优化课程信息传递、集散常见问题、补充阅读材料，为学生提供现代化的学习体验。

项目使用 [VitePress](https://vitepress.dev/) 开发。

## 开发

### Quick Start

```sh
git clone https://github.com/Tongji-High-level-Language-Programming/Website.git
pnpm install

# 预览（热更新）
pnpm run docs:dev

# 构建
pnpm run docs:build

# 预览构建产物
pnpm run docs:preview
```

### 项目结构

尽管目前本项目仅包含由 VitePress 生成的静态站点，但考虑对未来需求的兼容，项目主体仍被部署在单独的 `docs` 目录中。每个页面均应当在 `docs` 目录下创建子目录（除非极其简短、不需要额外引用资源）。

每个子目录下的 `index.md` 为页面主入口。对于页面内的图片，或只在单个页面内使用的小型 Vue 组件，均放在本目录内。

需要被多个页面共享使用、较为复杂的组件应在 `docs/.vitepress/theme/components` 中实现并全局注册。

需要提供下载的资源放置在 `docs/public` 目录中。

### CI/CD

所有在 `main` 分支上的更新均将被同步部署至 github.io 与同济内网服务器。其中，内网服务器的访问方式使用 [Enviorment Secret](https://docs.github.com/actions/learn-github-actions/contexts#secrets-context) 存储，如需维护请联系项目所有者。
