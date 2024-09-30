import {
  useState,
  useEffect,
  useCallback,
  Dispatch,
  SetStateAction,
} from 'react';

export const readStore = (key: string, fallback: any) => {
  try {
    const item = window.localStorage.getItem(key);
    return item === 'undefined'
      ? undefined
      : item
        ? JSON.parse(item)
        : fallback;
  } catch (error) {
    console.error(`Error reading localStorage key “${key}”:`, error);
    return fallback;
  }
};

export const writeStore = (key: string, val: any) => {
  try {
    const item = JSON.stringify(val);
    window.localStorage.setItem(key, item);
  } catch (error) {
    console.error(`Error writing localStorage key “${key}”:`, error);
  }
};

/**
 * Custom hook to manage state with localStorage persistance. Since write/read
 * from localStorage is synchronous, abstract this into a useEffect. Also bind
 * an event to write to storage when the page is closed, this remedies the
 * potential bug when having multiple tabs open consuming the same localStorage,
 * where a page reload would load the other tabs latest changes.
 *
 * @param {string} key - The localStorage key to store the state.
 * @param {any} [initState] - The initial state if no value in localStorage.
 * @returns A [state, setState] tupple just like useState.
 */

function usePersistentState<S>(
  key: string,
  initState?: S | (() => S),
): [S, Dispatch<SetStateAction<S>>] {
  const [state, setState] = useState(readStore(key, initState));
  const writeState = useCallback(() => writeStore(key, state), [key, state]);

  useEffect(() => {
    writeState();
    window.addEventListener('beforeunload', writeState);

    return () => window.removeEventListener('beforeunload', writeState);
  }, [writeState]);

  return [state, setState];
}

export default usePersistentState;
