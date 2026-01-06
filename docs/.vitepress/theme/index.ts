import type { Theme } from 'vitepress';
import DefaultTheme from "vitepress/theme";
import "./tailwind.css";

import CopyButton from './components/CopyButton.vue';

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    // 注册自定义全局组件
    app.component("CopyButton", CopyButton);
  },
} satisfies Theme;
