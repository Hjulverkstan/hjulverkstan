import { useQuery } from '@tanstack/react-query';

import { StandardError } from '../../api';
import * as api from './api';
import { GetTextParams, GetTextsParams } from './api';
import { Text } from './types';

//

export const useTextsQ = ({ lang }: GetTextsParams) =>
  useQuery<Text[], StandardError>(api.createGetTexts({ lang }));

export const useTextQ = ({ id, lang }: GetTextParams) =>
  useQuery<Text, StandardError>({
    ...api.createGetText({ id, lang }),
    enabled: !!id,
  });
