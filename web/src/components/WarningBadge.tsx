import BadgeGroup from '@components/BadgeGroup';
import { warningEnums } from '@data/warning/enums';
import { BadgeProps } from '@components/shadcn/Badge';
interface WarningBadgeProps {
  id: string;
  warnings: string[];
  variant: BadgeProps['variant'];
}
import { useTranslations } from '@hooks/useTranslations';

export default function WarningBadge({
  id,
  warnings,
  variant,
}: WarningBadgeProps) {
  const { t } = useTranslations();

  const warningFind = (value: string) =>
    warningEnums.find((e) => e.value === value) ?? {
      tooltipTranslationKey: undefined,
      icon: undefined,
    };

  const tooltip = warnings.length ? (
    <div>
      {warnings.map((warning, i) => {
        const key = warningFind(warning).tooltipTranslationKey;
        return (
          <span key={i}>
            {key ? t(key) : ''}
            {i < warnings.length - 1 && <br />}
          </span>
        );
      })}
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
