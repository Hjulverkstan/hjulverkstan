import { ComponentType } from 'react';
import { BadgeProps } from '@components/shadcn/Badge';
import { TranslationKeys } from '@data/translations';

export interface EnumAttributesRaw {
  value: any;
  dataKey: string;
  translationKey?: TranslationKeys;
  tooltipTranslationKey?: TranslationKeys;
  icon?: ComponentType<any>;
  /* Following fields aggregated in some business logic down the line */
  variant?: BadgeProps['variant'];
  children?: string[];
  count?: number;
}

export type EnumAttributes<V extends EnumAttributesRaw = EnumAttributesRaw> =
  V & {
    label: string;
  };

// The result of doing "import * as enumsRaw from '...'
export type EnumAttributesRawMap<Raw = EnumAttributesRaw> = Record<
  string,
  Raw[]
>;

// No longer a map of raw enums:
export type EnumAttributesMap<
  MapRaw extends EnumAttributesRawMap<Raw>,
  Raw extends EnumAttributesRaw = EnumAttributesRaw,
> = {
  [K in keyof MapRaw]: EnumAttributes<Raw>[];
};

//

export interface ListResponse<Entity> {
  content: Entity[];
}

//

export interface Auditable {
  createdAt: string;
  createdBy: string;
  updatedAt?: string;
  updatedBy?: string;
}
