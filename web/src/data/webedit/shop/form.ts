import { z } from 'zod';
import { Shop } from './types';
import { reqString } from '@data/form';

export const initShop = {} as Partial<Shop>;

export const shopZ = z.object({
  name: reqString('Shop name'),
  address: reqString('Address'),
});
