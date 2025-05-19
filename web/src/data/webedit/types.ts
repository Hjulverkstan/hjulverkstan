import { GeneralContentStripped } from './general/types';
import { Shop } from './shop/types';
import { Story } from './story/types';

export interface AllEntitiesRaw {
  generalContent: GeneralContentStripped[];
  shops: Shop[];
  story: Story[];
}

export interface AllEntities {
  generalContent: Record<string, string>;
  shops: Shop[];
  story: Story[];
}

export type LocaleAllEntitiesMap = Record<string, AllEntities>;
