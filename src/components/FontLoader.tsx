'use client';

import { useEffect } from 'react';

const FontLoader = () => {
  useEffect(() => {
    // Check if fonts are already loaded to prevent duplicates
    const existingLink = document.querySelector('link[href*="fonts.googleapis.com"]');
    if (existingLink) return;

    // Load Google Fonts
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);

    // Cleanup on unmount
    return () => {
      if (link.parentNode) {
        link.parentNode.removeChild(link);
      }
    };
  }, []);

  return null;
};

export default FontLoader;