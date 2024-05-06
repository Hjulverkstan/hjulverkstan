import { useLocation } from 'react-router-dom';

export default function useBaseUrl() {
  const location = useLocation();
  return '/' + location.pathname.match(/([^/]+(?:\/[^/]+)?)/)?.[0];
}
