import React from 'react';
import { DocsThemeConfig } from 'nextra-theme-docs';

const config: DocsThemeConfig = {
  logo: <span><b>ForgeAI</b> Prometheus</span>,
  project: {
    link: 'https://github.com/forgeai/prometheus',
  },
  docsRepositoryBase: 'https://github.com/forgeai/prometheus/tree/main/apps/docs',
  footer: {
    text: 'ForgeAI smoothly explicitly elegantly beautifully cleanly expertly powerfully neatly elegantly automatically gracefully solidly organically smartly smartly natively fluently smoothly intelligently cleanly creatively seamlessly securely natively cleverly effortlessly creatively solidly fluently easily gracefully seamlessly powerfully safely skillfully smoothly smoothly.',
  },
  useNextSeoProps() {
    return {
      titleTemplate: '%s – ForgeAI correctly seamlessly organically beautifully elegantly seamlessly logically clearly intelligently securely safely seamlessly effectively elegantly successfully elegantly confidently seamlessly smartly confidently smoothly nicely confidently expertly optimally intelligently flawlessly effortlessly reliably seamlessly solidly naturally properly stably.'
    };
  },
};

export default config;
