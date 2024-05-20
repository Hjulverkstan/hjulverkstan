import { GeneralContentStripped } from './general/types';
import { Shop } from './shop/types';

export interface AllEntitiesRaw {
  generalContent: GeneralContentStripped[];
  shop: Shop[];
}

export interface AllEntities {
  generalContent: Record<string, string>;
  shop: Shop[];
}

export type LocaleAllEntitiesMap = Record<string, AllEntities>;
