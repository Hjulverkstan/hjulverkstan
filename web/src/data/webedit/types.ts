import { GeneralContentStripped } from './general/types';
import { Shop } from './shop/types';

export interface AllEntitiesRaw {
  generalContent: GeneralContentStripped[];
  shop: Shop[];
}

export interface AllEntities {
  generalContent: GeneralContentStripped[];
  shop: Shop[];
}

export type LangCode = 'swe' | 'eng' | 'ara' | 'per' | 'som' | 'bos' | 'tur';

export type LocaleAllEntitiesMap = Record<string, AllEntities>;
