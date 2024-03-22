import { useState, useEffect, useRef } from 'react';
import { Loader2 } from 'lucide-react';

import { cn } from '@utils';

const DEBOUNCE_DELAY = 600;

const Spinner = ({
  className,
  visible,
}: {
  className?: string;
  /* Use this instead of conditionaly rendering it in the parent, it has built
   * in timeout so that it never flashes to quickly
   */
  visible: boolean;
}) => {
  const [internalVisible, setInternalVisible] = useState(false);
  const toggledOnTime = useRef(0);

  useEffect(() => {
    // Toggled on by parent
    if (!internalVisible && visible) {
      setInternalVisible(true);
      toggledOnTime.current = Date.now();
    }

    // Toggled of by parent
    if (internalVisible && !visible) {
      const timePassedSinceToggledOn = Date.now() - toggledOnTime.current;
      if (timePassedSinceToggledOn < DEBOUNCE_DELAY) {
        setTimeout(
          () => setInternalVisible(false),
          DEBOUNCE_DELAY - timePassedSinceToggledOn,
        );
      } else {
        setInternalVisible(false);
      }
    }
  }, [visible]);

  return (
    internalVisible && (
      <Loader2
        className={cn(
          'foreground-primary mx-2 h-4 w-4 animate-spin opacity-25',
          className,
        )}
      />
    )
  );
};

export default Spinner;
