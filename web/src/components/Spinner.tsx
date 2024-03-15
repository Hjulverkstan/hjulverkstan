import { cn } from '@utils';
import { Loader2 } from 'lucide-react';

const Spinner = ({ className }: { className?: string }) => {
  return <Loader2 className={cn('mx-2 h-4 w-4 animate-spin', className)} />;
};

export default Spinner;
