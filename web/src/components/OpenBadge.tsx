import { Badge } from '@components/shadcn/Badge';
import { cn } from '@utils';
import { useShopOpenStatus } from '@hooks/useShopOpenData';
import type { OpenHours } from '@data/webedit/shop/types';

interface OpenBadgeProps {
  openHours?: OpenHours | undefined | null;
  className?: string;
  variant?: 'badge' | 'minimal';
}

export const OpenBadge: React.FC<OpenBadgeProps> = ({
  openHours,
  className,
  variant = 'badge',
}) => {
  const isOpen = useShopOpenStatus(openHours);

  if (openHours === undefined || openHours === null) {
    return null;
  }

  const badgeSpecificVariant = isOpen ? 'successOutline' : 'destructiveOutline';
  const textColor = isOpen ? 'text-green-500' : 'text-yellow-600';
  const bgColor = isOpen ? 'bg-green-500' : 'bg-red-500';
  const text = isOpen ? 'Open' : 'Closed';
  const dotClasses = 'h-1.5 w-1.5 flex-shrink-0 rounded-full';

  return variant === 'minimal' ? (
    <div className={cn('flex items-center gap-3 text-lg', className)}>
      <span className={cn(dotClasses, bgColor)} aria-hidden="true"></span>
      <span className={textColor}>{text}</span>
    </div>
  ) : (
    <Badge
      variant={badgeSpecificVariant}
      borderless={true}
      className={cn('gap-2 bg-gray-100', textColor, className)}
    >
      <span className={cn(dotClasses, bgColor)} aria-hidden="true"></span>
      <span>{text}</span>
    </Badge>
  );
};
