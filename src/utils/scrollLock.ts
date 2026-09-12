import { useEffect } from 'react';

// Global lock reference counter to prevent multiple modals/drawers
// from corrupting each other's body scroll states.
let activeLocksCount = 0;

export function useBodyScrollLock(isLocked: boolean) {
  useEffect(() => {
    if (!isLocked) return;

    activeLocksCount += 1;
    if (activeLocksCount === 1) {
      // Save current scroll position and apply safe overflow hidden
      document.body.classList.add('overflow-hidden');
    }

    return () => {
      activeLocksCount = Math.max(0, activeLocksCount - 1);
      if (activeLocksCount === 0) {
        document.body.classList.remove('overflow-hidden');
        // Clean any stray inline lock styles
        document.body.style.overflow = '';
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.left = '';
        document.body.style.right = '';
        document.body.style.width = '';
        document.body.style.touchAction = '';
      }
    };
  }, [isLocked]);
}

