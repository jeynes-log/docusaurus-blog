import { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

import { themes } from 'prism-react-renderer';
const lightCodeTheme = themes.github;
const darkCodeTheme = themes.dracula;

const config: Config = {
  title: 'Jeynes의 개발 블로그',
  tagline: 'Dev Blog of Jeynes',
  url: 'https://jeynes.me',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  favicon: 'img/favicon.ico',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'jeynes', // Usually your GitHub org/user name.
  projectName: 'docusaurus-blog', // Usually your repo name.

  // Even if you don't use internalization, you can use this field to set useful
  // metadata like html lang. For example, if your site is Chinese, you may want
  // to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'ko',
    locales: ['ko'],
  },

  future: {
    faster: true,
    v4: true,
  },

  markdown: {
    format: 'detect',
    hooks: {
      onBrokenMarkdownLinks: 'warn',
    },
  },

  presets: [
    [
      'classic',
      {
        docs: false,
        blog: {
          routeBasePath: '/',
          blogSidebarTitle: '최근 게시물',
          blogSidebarCount: 8,
          showReadingTime: true,
          readingTime: ({ content, frontMatter, locale, defaultReadingTime }) =>
            frontMatter.hide_reading_time ? undefined : defaultReadingTime({ content, locale }),
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
        gtag: {
          trackingID: 'G-PY49L0QDW0',
          anonymizeIP: true,
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    navbar: {
      title: 'Jeynes의 개발 블로그',
      logo: {
        alt: 'Jeynes Logo',
        src: 'img/logo.svg',
      },
      items: [
        { to: '/tags', label: '분류', position: 'left' },
        { to: '/archive', label: '기록', position: 'left' },
        { to: '/topics', label: '글감', position: 'left' },
        {
          href: 'https://github.com/jeynes-log',
          position: 'right',
          className: 'header-github-link',
          'aria-label': 'GitHub repository',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Channel',
          items: [
            {
              label: 'Instagram',
              href: 'https://instagram.com/jeynes.log',
            },
            {
              label: 'GitHub',
              href: 'https://github.com/jeynes-log',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Jeynes의 개발 블로그. Built with Docusaurus. 🦖`,
    },
    prism: {
      theme: lightCodeTheme,
      darkTheme: darkCodeTheme,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
