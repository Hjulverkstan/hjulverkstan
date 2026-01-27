import { useEffect } from 'react';

export default function useKeyPress(
  targetKey: string,
  callback: (e: KeyboardEvent) => void,
) {
  useEffect(() => {
    const downHandler = (event: KeyboardEvent) => {
      if (event.key === targetKey) {
        callback(event);
      }
    };

    window.addEventListener('keydown', downHandler);

    return () => {
      window.removeEventListener('keydown', downHandler);
    };
  }, [targetKey, callback]);
}
