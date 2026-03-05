import { defineConfig } from 'astro/config';
import solid from '@astrojs/solid-js';
import tailwind from '@astrojs/tailwind';
import mdx from '@astrojs/mdx';

export default defineConfig({
  output: 'static',
  site: 'https://links.trincheira.dev',
  integrations: [
    solid(),
    tailwind(),
    mdx()
  ]
});
