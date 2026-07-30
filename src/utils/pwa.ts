// PWA Service Worker Helper & Offline/Bookmark State Utilities

const BOOKMARKS_STORAGE_KEY = 'quickpass_bookmarks_v1';
const RECENT_SEARCHES_KEY = 'quickpass_recent_v1';

export function registerServiceWorker() {
  if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/sw.js')
        .then((reg) => {
          console.log('Quick Pass SW registered:', reg.scope);
        })
        .catch((err) => {
          console.warn('Quick Pass SW registration failed:', err);
        });
    });
  }
}

// Bookmarks (Saved Phrases) LocalStorage Management
export function getSavedBookmarkIds(): string[] {
  try {
    const raw = localStorage.getItem(BOOKMARKS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : ['ph-01', 'vn-01', 'th-01', 'ph-08', 'vn-04'];
  } catch {
    return ['ph-01', 'vn-01', 'th-01'];
  }
}

export function toggleBookmarkId(phraseId: string): string[] {
  const current = getSavedBookmarkIds();
  let updated: string[];
  if (current.includes(phraseId)) {
    updated = current.filter((id) => id !== phraseId);
  } else {
    updated = [...current, phraseId];
  }
  try {
    localStorage.setItem(BOOKMARKS_STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to save bookmark:', e);
  }
  return updated;
}

// Check online/offline status hook helper
export function isBrowserOnline(): boolean {
  return typeof navigator !== 'undefined' ? navigator.onLine : true;
}
