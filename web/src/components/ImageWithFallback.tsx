import React, {
  ImgHTMLAttributes,
  ReactNode,
  useEffect,
  useState,
} from 'react';
import { buildImageUrl } from '@utils/buildImageUrl';

export interface ImageWithFallbackProps
  extends ImgHTMLAttributes<HTMLImageElement> {
  fallback: ReactNode | (() => ReactNode);
}

export const ImageWithFallback = ({
  fallback,
  alt,
  ...imgProps
}: ImageWithFallbackProps) => {
  const [srcWithError, setSrcWithError] = useState<string | null>(null);

  useEffect(() => {
    if (srcWithError && imgProps.src !== srcWithError) {
      setSrcWithError(null);
    }
  }, [imgProps.src, srcWithError]);

  if (srcWithError) {
    return typeof fallback === 'function' ? fallback() : fallback;
  }

  return (
    <img
      {...imgProps}
      src={buildImageUrl(imgProps.src)}
      alt={alt}
      onError={() => imgProps.src && setSrcWithError(imgProps.src)}
    />
  );
};
