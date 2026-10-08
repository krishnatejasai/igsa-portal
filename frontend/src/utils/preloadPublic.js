import { contentRequest } from './content';

export function preloadPublicPage(url) {
  let paths = [];
  if (url.pathname === '/community') {
    const kind = url.searchParams.get('kind') === 'travel' ? 'travel' : 'roommate';
    paths = [`community?kind=${kind}&page=1`];
    import('../pages/Community').catch(() => {});
  } else if (url.pathname === '/events' || url.pathname === '/') paths = ['events'];
  else if (url.pathname === '/board') paths = ['board-members'];
  else if (url.pathname === '/gallery') paths = ['gallery?summary=1'];
  paths.forEach(path => { contentRequest(path, { public: true }).catch(() => {}); });
}

export function installPublicPreloading() {
  preloadPublicPage(new URL(window.location.href));
  const onIntent = event => {
    const link = event.target.closest?.('a[href]');
    if (!link) return;
    const url = new URL(link.href, window.location.href);
    if (url.origin === window.location.origin) preloadPublicPage(url);
  };
  // Only actual navigation intent; no periodic keep-alive requests or extra service.
  document.addEventListener('pointerover', onIntent, { passive: true });
  document.addEventListener('focusin', onIntent);
  document.addEventListener('touchstart', onIntent, { passive: true });
}
