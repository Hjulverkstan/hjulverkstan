import { EnumAttributes } from '@data/enums';
import * as Command from '@components/shadcn/Command';
import * as C from '@utils/common';
import { CheckIcon, MinusIcon } from 'lucide-react';

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
  return (
    <Command.Item
      key={e.value}
      onSelect={onClick}
      disabled={checkBox === 'unchecked' && e.count === 0}
      className="w-full"
    >
      <div
        className={C.cn(
          'mr-2 flex h-4 w-4 items-center justify-center rounded-sm border',
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
          'flex flex-grow items-center',
          checkBox !== 'unchecked' && e.count === 0 && 'opacity-50',
        )}
      >
        {e.icon && <e.icon className="text-muted-foreground mr-2 h-4 w-4" />}
        <span>{e.label}</span>
        {e.count !== undefined && (
          <span
            className="ml-auto flex h-4 w-4 items-center justify-center
font-mono text-xs"
          >
            {e.count}
          </span>
        )}
      </div>
    </Command.Item>
  );
}
