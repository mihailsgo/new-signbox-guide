// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// GitHub Pages project site: https://mihailsgo.github.io/new-signbox-guide/
export default defineConfig({
  site: 'https://mihailsgo.github.io',
  base: '/new-signbox-guide',
  trailingSlash: 'always',
  integrations: [
    starlight({
      title: 'TrustLynx SignBox',
      description:
        'User guide for the TrustLynx SignBox e-signing solution — login, initiating a signing process, Smart-ID signing, templates, tracking and more.',
      tagline: 'Electronic signing, end to end.',
      logo: {
        light: './src/assets/trustlynx-logo.png',
        dark: './src/assets/trustlynx-logo-dark.png',
        replacesTitle: true,
      },
      favicon: '/favicon.ico',
      customCss: ['./src/styles/brand.css'],
      components: {
        Head: './src/components/Head.astro',
        Footer: './src/components/Footer.astro',
        // default to dark mode for first-time visitors (toggle still works)
        ThemeProvider: './src/components/ThemeProvider.astro',
        ThemeSelect: './src/components/ThemeSelect.astro',
      },
      social: [
        {
          icon: 'github',
          label: 'GitHub',
          href: 'https://github.com/mihailsgo/new-signbox-guide',
        },
      ],
      sidebar: [
        {
          label: 'Get started',
          items: ['concepts', 'before-you-start', 'login'],
        },
        {
          label: 'Create & manage',
          items: ['initiating', 'templates-contacts', 'management'],
        },
        { label: 'Sign documents', items: ['signing'] },
        { label: 'Track & status', items: ['tracking'] },
        { label: 'Reference', items: ['appendix'] },
      ],
      lastUpdated: false,
      pagination: true,
    }),
  ],
});
