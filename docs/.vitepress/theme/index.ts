import type { Theme } from "vitepress";
import DefaultTheme from "vitepress/theme";
import "./tailwind.css";

import CopyButton from "./components/CopyButton.vue";
import ProblemGroup from "./components/ProblemGroup.vue";
import ProblemItem from "./components/ProblemItem.vue";
import SyntaxRestriction from "./components/SyntaxRestriction.vue";
import ProblemSamples from "./components/ProblemSamples.vue";

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    // 注册自定义全局组件
    app
      .component("CopyButton", CopyButton)
      .component("ProblemGroup", ProblemGroup)
      .component("ProblemItem", ProblemItem)
      .component("ProblemSamples", ProblemSamples)
      .component("SyntaxRestriction", SyntaxRestriction);
  },
} satisfies Theme;
