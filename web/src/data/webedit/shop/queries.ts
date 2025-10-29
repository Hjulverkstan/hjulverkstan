import { useQuery } from '@tanstack/react-query';

import { StandardError } from '../../api';
import * as api from './api';
import { Shop } from './types';
import { GetShopParams, GetShopsParams } from './api';

//

export const useShopsQ = ({ locale }: GetShopsParams) =>
  useQuery<Shop[], StandardError>(api.createGetShops({ locale }));

export const useShopQ = ({ id, locale }: GetShopParams) =>
  useQuery<Shop, StandardError>({
    ...api.createGetShop({ id, locale }),
    enabled: !!id,
  });
