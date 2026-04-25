# Contributing

感谢你为同济高程课程网站做出贡献。

项目使用 [VitePress](https://vitepress.dev/) 开发。开发非文档内容之前建议阅读 VitePress 官方文档。


## 本地开发

### 安装依赖

需要的工具：

- Node.js
- pnpm
- git
- git lfs

### Quick Start

```sh
git lfs install

git clone https://github.com/Tongji-High-level-Language-Programming/Website.git
pnpm install

# 预览（热更新）
pnpm run docs:dev

# 预览（热更新，在所有IP上监听5173端口）
pnpm run docs:dev --host

# 构建
pnpm run docs:build

# 预览构建产物
pnpm run docs:preview
```

### 文本文件格式

仓库通过 `.gitattributes` 统一文本文件使用 `LF` 换行符。一般不需要手动处理；如果提交中只出现了 line ending 变更，请先检查编辑器或 Git 配置。

### 文档开发

需要自行掌握 Markdown 语法。

- VitePress 中拓展的 Markdown 特性请参考 [VitePress Markdown 语法](https://vitepress.dev/zh/guide/markdown)。
- 图片资源放在页面所在目录下，使用相对路径
- 资源文件放在 `docs/public` 目录下，构建时会被复制到 `dist` 的根目录，因此引用时需要使用 `/` 根目录路径

## 项目结构

尽管目前本项目仅包含由 VitePress 生成的静态站点，但考虑对未来需求的兼容，项目主体仍被部署在单独的 `docs` 目录中。每个页面均应当在 `docs` 目录下创建子目录 \<page\>，除非页面极其简短且不需要额外引用资源。

```text
.
├── docs/
│   ├── index.md
│   ├── <page>/
│   │   ├── index.md
│   │   ├── image.png
│   │   └── LocalComponent.vue
│   ├── public/
│   │   └── <static-assets>
│   └── .vitepress/
│       ├── config.mts
│       └── theme/
│           └── components/
│               └── <shared-components>
├── patches/
├── README.md
├── CONTRIBUTING.md
└── Roadmap.md
```

每个子目录下的 `index.md` 为页面主入口。对于页面内的图片，或只在单个页面内使用的小型 Vue 组件，均放在本目录内。

子目录下的 `LocalComponent.vue` 表示仅供当前页面使用的小型 Vue 组件，例如交互式示例、小工具或局部展示组件。这类组件应与对应页面的 `index.md` 放在同一目录下，便于就近维护；被多个页面复用的组件，应放入 `docs/.vitepress/theme/components` 中统一管理，并在 `index.ts` 中注册。

子目录下的 `config.mts` 为 VitePress 站点配置文件，用于定义导航、侧边栏、搜索、主题配置及 Markdown 扩展等全局行为。

需要提供下载的资源放置在 `docs/public` 目录中。

## 开发路线图

[开发路线图](/Roadmap.md)

## Patch更新记录及说明

### patch 方式
以 pnpm 包 patch 为例。

使用 `pnpm patch <name>` 来拉取对应包名的文件，在命令输出的提示中会显示文件的路径。在这个路径下修改文件即可。

例如：
```sh
pnpm patch vitepress
```
得到的 pnpm 包文件路径，一般在 `node_modules/.pnpm` 目录下。

要对 vitepress 构建进行补丁，需要额外拉取 `vitepress` 项目源码（最好是下载对应release版本的source code）

在这个额外的项目中应用你的补丁之后进行构建，将输出的构建文件和前面得到的 pnpm 包文件进行对比，注意一些构建可能会有的命名差别，将文件精确复制覆盖即可。

最后使用 `pnpm patch-commit <目录>` 来生成补丁。这个命令会在刚开始的`pnpm patch vitepress` 中被提示，目录同理。


### 更新记录

#### vitepress@2.0.0-alpha.17.patch

对vitepress的2.0.0-alpha.17版本进行补丁，在这个项目中主要作用为[修复 `download` 属性在处理的时候不进行`base URL logic`的问题](https://github.com/vuejs/vitepress/pull/5186)

由于修复已在上游被合并，在下一个vitepress版本中，将不再需要此补丁

## CI/CD

所有在 `main` 分支上的更新均将被同步部署至 GitHub Pages 与同济内网服务器。其中，内网服务器的访问方式使用 [Environment Secret](https://docs.github.com/actions/learn-github-actions/contexts#secrets-context) 存储，如需维护请[联系项目所有者](./README.md#联系我们)。

## 常见问题

`pnpm run docs:dev` 预览网站发现原有的图片无法显示：
- 检查是否下载了 git lfs，且需要在 git clone 之前下载。
- 若在 clone 后下载，需要 git lfs pull 来获取图片。
