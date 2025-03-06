import BadgeGroup from '@components/BadgeGroup';
import { find as warningFind } from '@data/warning/enums';
import { BadgeProps } from '@components/shadcn/Badge';
interface WarningBadgeProps {
  id: string;
  warnings: string[];
  variant: BadgeProps['variant'];
}

export default function WarningBadge({
  id,
  warnings,
  variant,
}: WarningBadgeProps) {
  const tooltip = warnings.length ? (
    <div>
      {warnings.map((warning, i) => (
        <span key={i}>
          {warningFind(warning).tooltip}
          {i < warnings.length - 1 && <br />}
        </span>
      ))}
    </div>
  ) : undefined;

  const icon = warnings.length ? warningFind(warnings[0]).icon : undefined;

  return (
    <BadgeGroup
      badges={[
        {
          icon,
          label: `#${id}`,
          variant,
          tooltip,
        },
      ]}
    />
  );
}
