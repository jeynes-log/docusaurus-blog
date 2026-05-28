import { useEffect, useRef } from 'react';
import OriginalBlogPostItem from '@theme-original/BlogPostItem';
import type { Props } from '@theme/BlogPostItem';

import { useBlogPost } from '@docusaurus/plugin-content-blog/client';
import { useColorMode } from '@docusaurus/theme-common';

const utterancesSelector = 'iframe.utterances-frame';

export default function BlogPostItem(props: Props): JSX.Element {
  const { isBlogPostPage } = useBlogPost();
  const { colorMode } = useColorMode();
  const utterancesTheme = colorMode === 'dark' ? 'github-dark' : 'github-light';
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isBlogPostPage || !containerRef.current) return;

    const container = containerRef.current;
    const utterancesEl = container.querySelector<HTMLIFrameElement>(utterancesSelector);

    const createUtterancesEl = () => {
      const script = document.createElement('script');

      script.src = 'https://utteranc.es/client.js';
      script.setAttribute('repo', 'jeynes-log/blog-comments');
      script.setAttribute('issue-term', 'pathname');
      script.setAttribute('label', 'comment');
      script.setAttribute('theme', utterancesTheme);
      script.crossOrigin = 'anonymous';
      script.async = true;

      container.appendChild(script);
    };

    const postThemeMessage = () => {
      const message = {
        type: 'set-theme',
        theme: utterancesTheme,
      };

      utterancesEl?.contentWindow?.postMessage(message, 'https://utteranc.es');
    };

    if (utterancesEl) {
      postThemeMessage();
    } else {
      createUtterancesEl();
    }

    return () => {
      container.querySelector(utterancesSelector)?.remove();
      container.querySelector('script[src="https://utteranc.es/client.js"]')?.remove();
    };
  }, [isBlogPostPage, utterancesTheme]);

  return (
    <>
      <OriginalBlogPostItem {...props} />
      {isBlogPostPage && <div ref={containerRef} />}
    </>
  );
}
