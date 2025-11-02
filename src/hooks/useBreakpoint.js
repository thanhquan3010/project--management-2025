import { useEffect, useState } from 'react';

export const useBreakpoint = (value) => {
  const isClient = typeof window !== 'undefined';
  const [matches, setMatches] = useState(() => (isClient ? window.innerWidth <= value : false));

  useEffect(() => {
    if (!isClient) return undefined;

    const handleResize = () => setMatches(window.innerWidth <= value);
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isClient, value]);

  return matches;
};
