import { useQuery } from '@tanstack/react-query';

import { StandardError } from '../../api';
import * as api from './api';
import { Shop } from './types';
import { GetShopParams, GetShopsParams } from './api';

//

export const useShopsQ = ({ lang }: GetShopsParams) =>
  useQuery<Shop[], StandardError>(api.createGetShops({ lang }));

export const useShopQ = ({ id, lang }: GetShopParams) =>
  useQuery<Shop, StandardError>({
    ...api.createGetShop({ id, lang }),
    enabled: !!id,
  });
