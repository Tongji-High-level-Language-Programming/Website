import { defineConfig } from "vitepress";
import tailwindcss from "@tailwindcss/vite";
import markdownItFootnote from "markdown-it-footnote";
import markdownItContainer from "markdown-it-container";
import markdownItMath from "markdown-it-math/temml"

// From: https://www.afunny.top/vitepress-search
// 自定义分词函数
function customTokenizer(text: string): string[] {
  // 去除空格，每个字分词
  return Array.from(
    new Intl.Segmenter("cn", { granularity: "word" }).segment(
      text.replace(/ /g, "")
    )
  ).map((item) => item.segment);
}

// https://vitepress.dev/reference/site-config
export default defineConfig({
  base: "/Website/", // Base URL for the site, for GitHub Pages
  lang: "zh-Hans-CN",
  title: "同济高程",
  description: "同济大学高级语言程序设计课程网站",
  head: [["link", { rel: "icon", href: "/Website/Tongji.svg" }]],
  lastUpdated: true,
  markdown: {
    config: (md) => {
      md.use(markdownItFootnote);
      md.renderer.rules.footnote_block_open = () =>
        "<h3>附注</h3>\n" +
        '<section class="footnotes">\n' +
        '<ol class="footnotes-list">\n';

      md.use(markdownItMath, {
        
      })
      
      md.use(markdownItContainer, "problem-group", {
        marker: '%',
        render: (tokens, idx: number) => {
          if (tokens[idx].nesting === 1) {
            // 开标签
            return `<ProblemGroup>\n`;
          } else {
            // 闭标签
            return `</ProblemGroup>\n`;
          }
        },
      }).use(markdownItContainer, "problem-item", {
        render: (tokens, idx: number) => {
          const m = tokens[idx].info.trim().match(/^problem-item\s+(.*)\s+(.*)$/);
          if (tokens[idx].nesting === 1) {
            // 获取 ;;; problem-item 后面写的标题
            const name = m ? m[1] : "New Problem";
            const title = m ? m[2] : "New Problem";
            return `<ProblemItem name="${name}" title=${title}>\n`;
          } else {
            return `</ProblemItem>\n`;
          }
        },
        marker: ';'
      });
    },
    lineNumbers: true,
  },
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    footer: {
      message:
        '本站全部内容在<a href="https://creativecommons.org/licenses/by-nc-sa/4.0/deed.zh-hans">知识共享 署名-非商业性使用-相同方式共享 4.0 协议</a>之条款下提供',
      copyright: "©2025 同济大学 版权所有",
    },
    logo: {
      src: "/Tongji.svg",
      alt: "Tongji University",
    },
    nav: [
      { text: "首页", link: "/" },
      { text: "课程", link: "/syllabus/" },
      { text: "资源", link: "/resources/" },
      { text: "作业", link: "/assignments/" },
      { text: "考试", link: "/exam" },
      { text: "FAQ", link: "/faq/" },
      { text: "参考图表", link: "/tables/" },
      { text: "扩展阅读", link: "/reading/" },
      { text: "联系我们", link: "/contact" },
    ],

    sidebar: [
      {
        text: "课程介绍",
        link: "/syllabus/",
        items: [
          { text: "课程政策", link: "/syllabus/#课程政策" },
          { text: "教材与课程资源", link: "/syllabus/#教材与课程资源" },
        ],
      },
      {
        text: "开始学习",
        link: "/getting-started/",
        items: [
          { text: "预备知识", link: "/getting-started/#预备知识" },
          { text: "学习用电脑", link: "/getting-started/#学习用电脑" },
          {
            text: "环境配置",
            link: "/getting-started/#环境配置",
            items: [
              {
                text: "Visual Studio 2022 的安装与配置",
                link: "/getting-started/setup/01/",
              },
              {
                text: "用 VS2022 编译 C++ 程序",
                link: "/getting-started/setup/02/",
              },
              {
                text: "Dev-C++ 的安装、汉化与配置(Ver 5.11 TDM GCC 9.2.0 特别版本)",
                link: "/getting-started/setup/03/",
              },
              {
                text: "用 Dev-C++ 编译已在 VS2022 下通过的 C++ 程序",
                link: "/getting-started/setup/04/",
              },
            ],
          },
          { text: "完成准备", link: "/getting-started/#完成准备" },
        ],
      },
      {
        text: "作业",
        link: "/assignments/",
        items: [
          { text: "第一周", link: "/assignments/week1" },
          { text: "第二周", link: "/assignments/week2" },
          { text: "第三周", link: "/assignments/week3" }
        ],
      },
      {
        text: "学会提问",
        link: "/ask-question/",
      },
      {
        text: "常见问题",
        link: "/faq/",
      },
      {
        text: "参考图表",
        link: "/tables/",
      },
      {
        text: "扩展阅读",
        link: "/reading/",
      },
    ],

    socialLinks: [
      {
        icon: "github",
        link: "https://github.com/Tongji-High-level-Programming-Language/Website",
      },
    ],

    search: {
      provider: "local",
      options: {
        locales: {
          root: {
            translations: {
              button: {
                buttonText: "搜索",
                buttonAriaLabel: "搜索",
              },
              modal: {
                displayDetails: "显示详细列表",
                resetButtonTitle: "重置搜索",
                backButtonTitle: "关闭搜索",
                noResultsText: "没有结果",
                footer: {
                  selectText: "选择",
                  navigateText: "导航",
                  closeText: "关闭",
                },
              },
            },
          },
        },
        miniSearch: {
          options: {
            tokenize: customTokenizer,
          },
        },
      },
    },
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
