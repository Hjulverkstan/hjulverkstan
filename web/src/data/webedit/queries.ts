import { useQuery } from '@tanstack/react-query';

import { GetLangCountParams } from './api';
import * as api from './api';

export const useLangCountQ = ({ entity }: GetLangCountParams) =>
  useQuery(api.createGetLangCount({ entity }));
