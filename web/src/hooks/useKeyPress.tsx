import { useEffect } from 'react';

export default function useKeyPress(
  targetKey: string,
  callback: (key: string) => void,
) {
  useEffect(() => {
    const downHandler = (event: KeyboardEvent) => {
      if (event.code === targetKey) {
        callback(event.code);
      }
    };

    window.addEventListener('keydown', downHandler);

    return () => {
      window.removeEventListener('keydown', downHandler);
    };
  }, [targetKey, callback]);
}
