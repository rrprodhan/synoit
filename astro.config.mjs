import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://synoit.com',
  integrations: [sitemap()],
  output: 'static',
  // Keep local performance audits focused on the site, not Astro's sizeable
  // development audit toolbar and its dependency graph.
  devToolbar: {
    enabled: false
  }
});
