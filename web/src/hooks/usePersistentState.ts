import {
  useState,
  useEffect,
  useCallback,
  Dispatch,
  SetStateAction,
} from 'react';

export const readStore = (key: string) => {
  try {
    const item = window.localStorage.getItem(key);
    return item === 'undefined' || item === null ? undefined : JSON.parse(item);
  } catch (error) {
    console.error(`Error reading localStorage key “${key}”:`, error);
    return undefined;
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
 * @param [initState] - If is function, will receive value from store and return
 *   init state to be passed the internal useState(initState), if not function
 *   defined, will pass directly to useState(initState).
 * @returns A [state, setState] tuple just like useState.
 */

function usePersistentState<S>(
  key: string,
  initState?: S | ((fromStore?: S) => S),
): [S, Dispatch<SetStateAction<S>>] {
  const toInitState =
    typeof initState === 'function'
      ? (initState as (s?: S) => S)
      : (fromStore?: S) => fromStore ?? initState;

  const [state, setState] = useState(() => toInitState(readStore(key)));

  const writeState = useCallback(() => writeStore(key, state), [key, state]);

  useEffect(() => {
    writeState();
    window.addEventListener('beforeunload', writeState);

    return () => window.removeEventListener('beforeunload', writeState);
  }, [writeState]);

  return [state as S, setState as Dispatch<SetStateAction<S>>];
}

export default usePersistentState;
