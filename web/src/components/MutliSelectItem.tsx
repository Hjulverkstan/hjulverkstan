import { EnumAttributes } from '@data/types';
import * as Command from '@components/shadcn/Command';
import * as C from '@utils/common';
import { CheckIcon, MinusIcon } from 'lucide-react';
import { useMemo } from 'react';

interface MultiSelectItemProps {
  enumAttr: EnumAttributes;
  isIndented?: boolean;
  checkBox: 'checked' | 'unchecked' | 'intermediate';
  onClick: () => void;
}

export default function MultiSelectItem({
  enumAttr: e,
  isIndented,
  checkBox,
  onClick,
}: MultiSelectItemProps) {
  const safeValue = useMemo(
    () =>
      e.label
        ?.toString()
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '') || e.value,
    [e.label, e.value],
  );

  return (
    <Command.Item
      key={e.value}
      value={safeValue}
      onSelect={onClick}
      disabled={checkBox === 'unchecked' && e.count === 0}
      className="w-full cursor-pointer"
    >
      <div
        className={C.cn(
          `mr-2 flex h-4 w-4 shrink-0 items-center justify-center rounded-sm
          border`,
          checkBox === 'unchecked'
            ? 'border-secondary-foreground opacity-50'
            : 'border-primary bg-primary text-primary-foreground',
          isIndented && 'ml-4',
        )}
      >
        {checkBox === 'checked' && <CheckIcon className="h-4 w-4" />}
        {checkBox === 'intermediate' && <MinusIcon className="h-4 w-4" />}
      </div>
      <div
        className={C.cn(
          'flex flex-grow items-center whitespace-pre-line py-1',
          checkBox !== 'unchecked' && e.count === 0 && 'opacity-50',
        )}
      >
        {e.icon && (
          <e.icon className="text-muted-foreground mr-2 h-4 w-4 shrink-0" />
        )}
        <span className="leading-tight">
          {e.label?.toString().replace(' | ', '\n')}
        </span>
        {e.count !== undefined && (
          <span
            className="ml-auto flex h-4 w-4 shrink-0 items-center justify-center
              font-mono text-xs"
          >
            {e.count}
          </span>
        )}
      </div>
    </Command.Item>
  );
}
