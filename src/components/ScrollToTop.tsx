import { useEffect } from 'react';

interface ScrollToTopProps {
  currentPath: string;
}

export function ScrollToTop({ currentPath }: ScrollToTopProps) {
  useEffect(() => {
    // Scroll to top instantly on path changes
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;

    // Additional frame check to handle layout updates on mobile browsers
    const timer = setTimeout(() => {
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    }, 10);

    return () => clearTimeout(timer);
  }, [currentPath]);

  return null;
}

