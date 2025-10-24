import BadgeGroup from '@components/BadgeGroup';
import * as enumsRaw from '@data/warning/enums';
import { BadgeProps } from '@components/shadcn/Badge';
interface WarningBadgeProps {
  id: string;
  warnings: string[];
  variant: BadgeProps['variant'];
}
import { useTranslations } from '@hooks/useTranslations';
import { useTranslateRawEnums } from '@hooks/useTranslateRawEnums';
import { findEnum } from '@utils/enums';

export default function WarningBadge({
  id,
  warnings,
  variant,
}: WarningBadgeProps) {
  const { t } = useTranslations();
  const enums = useTranslateRawEnums(enumsRaw);
  const warningFind = (value: string) => findEnum(enums, value);

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
